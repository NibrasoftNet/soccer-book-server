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

@Injectable()
export class FilesService {
  private readonly storage;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly awsS3Service: AwsS3Service,
    private readonly i18n: I18nService,
    private dataSource: DataSource,
  ) {
    this.storage = this.configService.getOrThrow('file.driver', {
      infer: true,
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
    const fileToUpdate = await this.findOneOrFail({
      id,
    });
    const fileKey = this.extractKeyFromUrl(fileToUpdate.path);
    this.storage === 'local'
      ? this.deleteFileFromLocal(fileKey)
      : await this.awsS3Service.deleteFromS3Bucket(fileKey);

    // Create new path for updated file
    const path = {
      local: `${this.configService.get('app.backendDomain', { infer: true })}/${this.configService.get('app.apiPrefix', { infer: true })}/v1/files/${
        file.filename
      }`,
      s3: (file as Express.MulterS3.File).location,
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
    this.storage === 'local'
      ? this.deleteFileFromLocal(fileKey)
      : await this.awsS3Service.deleteFromS3Bucket(fileKey);

    return await this.fileRepository.delete(fileToDelete.id);
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
  deleteFileFromLocal(key: string): boolean {
    const filePath = path.join(process.cwd(), 'uploads', key);
    fs.unlink(filePath, (err) => {
      if (err) {
        throw new HttpException(
          {
            status: HttpStatus.EXPECTATION_FAILED,
            errors: {
              file: this.i18n.t('file.failedDelete', {
                lang: I18nContext.current()?.lang,
              }),
            },
          },
          HttpStatus.EXPECTATION_FAILED,
        );
      }
    });
    return true;
  }

  async createFileFromS3(url: string): Promise<FileEntity> {
    const existingFile = await this.fileRepository.findOne({
      where: { path: url },
    });
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

  async createFileFromUrl(url: string): Promise<FileEntity> {
    const file = this.fileRepository.create({ path: url });
    return await this.fileRepository.save(file);
  }
}
