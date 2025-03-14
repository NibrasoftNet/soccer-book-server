import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entities/file.entity';
import {
  DataSource,
  DeleteResult,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { AllConfigType } from '../config/config.type';
import * as fs from 'fs';
import * as path from 'path';
import { AwsS3Service } from '../utils/aws-s3/aws-s3.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { MulterFile } from 'fastify-file-interceptor';
import { CloudinaryService } from '../utils/cloudinary/cloudinary.service';
import { FileDriver } from '@/enums/file/file-driver.enum';
import { NullableType } from '../utils/types/nullable.type';
import { PresignedUrlResponseDto } from '@/domains/files/presign-url-response.dto';
import { WinstonLoggerService } from '../logger/winston-logger.service';

@Injectable()
export class FilesService {
  private readonly storage: FileDriver;
  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly awsS3Service: AwsS3Service,
    private readonly cloudinaryService: CloudinaryService,
    private readonly i18n: I18nService,
    private dataSource: DataSource,
    private readonly logger: WinstonLoggerService,
  ) {
    this.storage = this.configService.getOrThrow('file.driver', {
      infer: true,
    });
  }

  async findOne(
    fields: FindOptionsWhere<FileEntity>,
  ): Promise<NullableType<FileEntity>> {
    return await this.fileRepository.findOne({
      where: fields,
    });
  }

  async findOneOrFail(
    fields: FindOptionsWhere<FileEntity>,
  ): Promise<FileEntity> {
    return await this.fileRepository.findOneOrFail({
      where: fields,
    });
  }

  async uploadFile(
    file: MulterFile | Express.MulterS3.File,
  ): Promise<FileEntity> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            file: this.i18n.t('file.failedUpload', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const path = {
      local: `${this.configService.get('app.backendDomain', { infer: true })}/${this.configService.get('app.apiPrefix', { infer: true })}/v1/files/${
        file.filename
      }`,
      s3: (file as Express.MulterS3.File).location,
      cloudinary: (file as MulterFile).path,
    };
    return this.fileRepository.save(
      this.fileRepository.create({
        path: path[
          this.configService.getOrThrow('file.driver', { infer: true })
        ],
      }),
    );
  }

  async uploadMultipleFiles(
    files: Array<MulterFile | Express.MulterS3.File>,
  ): Promise<FileEntity[]> {
    if (!files) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            file: this.i18n.t('file.failedUpload', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    return await this.dataSource.transaction(async (manager) => {
      return await Promise.all(
        files.map(async (file) => {
          const path = {
            local: `${this.configService.get('app.backendDomain', { infer: true })}/${this.configService.get('app.apiPrefix', { infer: true })}/v1/files/${
              file.filename
            }`,
            s3: (file as Express.MulterS3.File).location,
            cloudinary: (file as MulterFile).path,
          };
          return await manager.save(
            this.fileRepository.create({
              path: path[
                this.configService.getOrThrow('file.driver', { infer: true })
              ],
            }),
          );
        }),
      );
    });
  }

  /**
   * Update file in storage and database
   * @returns {Promise<FileEntity>} success update of the file
   * @param id
   * @param file
   */
  async updateFile(
    id: string,
    file: MulterFile | Express.MulterS3.File,
  ): Promise<FileEntity> {
    if (!file) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            file: this.i18n.t('file.failedUpload', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    // Delete old file
    const fileToUpdate = await this.findOneOrFail({ id });
    const fileKey = this.extractKeyFromUrl(fileToUpdate.path);
    await this.handleDelete(this.storage, fileKey, fileToUpdate.path);

    // Create new path for updated file
    const path = {
      local: `${this.configService.get('app.backendDomain', { infer: true })}/${this.configService.get('app.apiPrefix', { infer: true })}/v1/files/${
        file.filename
      }`,
      s3: (file as Express.MulterS3.File).location,
      cloudinary: (file as MulterFile).path,
    };

    const updatedFile = Object.assign({}, fileToUpdate, {
      path: path[this.storage],
    });
    return this.fileRepository.save(updatedFile);
  }

  /**
   * Delete file from storage and database
   * @returns {Promise<DeleteResult>} success deletion of the file
   * @param id
   */
  async deleteFile(id: string): Promise<DeleteResult> {
    const fileToDelete = await this.findOneOrFail({ id });
    const fileKey = this.extractKeyFromUrl(fileToDelete.path);

    // Call the appropriate delete handler
    await this.handleDelete(this.storage, fileKey, fileToDelete.path);

    // Delete the record from the database
    return this.fileRepository.delete(fileToDelete.id);
  }

  private async handleDelete(
    storage: FileDriver,
    fileKey: string,
    filePath: string,
  ): Promise<void> {
    const deleteHandlers: Record<FileDriver, () => Promise<boolean>> = {
      [FileDriver.LOCAL]: async () => await this.deleteFileFromLocal(fileKey),
      [FileDriver.S3]: async () =>
        await this.awsS3Service.deleteFromS3Bucket(fileKey),
      [FileDriver.CLOUDINARY]: async () =>
        await this.cloudinaryService.deleteFile(filePath),
    };

    const handler = deleteHandlers[storage];

    if (!handler) {
      throw new HttpException(
        {
          status: HttpStatus.EXPECTATION_FAILED,
          errors: {
            file: `Unsupported storage driver: ${storage}`,
          },
        },
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    await handler();
  }

  /**
   * Extract the file key using its url
   * @returns {string} file key
   * @param url
   */
  extractKeyFromUrl(url: string): string {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  }

  /**
   * Delete file from local uploads storage
   * @returns {Promise<boolean>} success deletion of the file
   * @param {string} key local file key
   */
  async deleteFileFromLocal(key: string): Promise<boolean> {
    const filePath = path.join(process.cwd(), 'uploads', key);

    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          reject(
            new HttpException(
              {
                status: HttpStatus.EXPECTATION_FAILED,
                errors: {
                  file: this.i18n.t('file.failedDelete', {
                    lang: I18nContext.current()?.lang,
                  }),
                },
              },
              HttpStatus.EXPECTATION_FAILED,
            ),
          );
        } else {
          resolve(true); // Resolve with true when file deletion succeeds
        }
      });
    });
  }

  async createFileFromUrl(url: string): Promise<FileEntity> {
    const existingFile = await this.findOne({ path: url });
    if (!!existingFile) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            file: this.i18n.t('file.fileExists', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const file = this.fileRepository.create({ path: url });
    return await this.fileRepository.save(file);
  }

  async getPresignedUrl(type: string): Promise<PresignedUrlResponseDto> {
    this.logger.info(`get-presigned-Url`, {
      description: `get presigned Url`,
      class: FilesService.name,
      function: 'getPresignedUrl',
    });
    return await this.awsS3Service.generatePresignedUrl(type);
  }
}
