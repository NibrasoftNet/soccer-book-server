import { Global, HttpException, HttpStatus, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { AllConfigType } from 'src/config/config.type';
import { SharedService } from './shared.service';
import { JwtModule } from '@nestjs/jwt';
import { IsUniqueOrAppend } from '../utils/validators/is-unique-or-append';
import { FastifyMulterModule, MulterFile } from 'fastify-file-interceptor';
import { CloudinaryService } from '../utils/cloudinary/cloudinary.service';
import { FastifyRequest } from 'fastify';

@Global()
@Module({
  imports: [
    JwtModule.register({}),
    FastifyMulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService, CloudinaryService],
      useFactory: (
        configService: ConfigService<AllConfigType>,
        cloudinaryService: CloudinaryService,
      ) => {
        const storages = {
          local: () =>
            diskStorage({
              destination: './uploads',
              filename: (request, file, callback) => {
                callback(
                  null,
                  `${randomStringGenerator()}.${file.originalname
                    .split('.')
                    .pop()
                    ?.toLowerCase()}`,
                );
              },
            }),
          s3: () => {
            const s3 = new S3Client({
              region: configService.get('file.awsS3Region', { infer: true }),
              credentials: {
                accessKeyId: configService.getOrThrow('file.accessKeyId', {
                  infer: true,
                }),
                secretAccessKey: configService.getOrThrow(
                  'file.secretAccessKey',
                  { infer: true },
                ),
              },
            });

            return multerS3({
              s3: s3,
              bucket: configService.getOrThrow('file.awsDefaultS3Bucket', {
                infer: true,
              }),
              acl: 'public-read',
              contentType: multerS3.AUTO_CONTENT_TYPE,
              key: (request, file, callback) => {
                callback(
                  null,
                  `${randomStringGenerator()}.${file.originalname
                    .split('.')
                    .pop()
                    ?.toLowerCase()}`,
                );
              },
            });
          },
          cloudinary: () => {
            const uploadResult = (
              request: Request | FastifyRequest,
              file: MulterFile | Express.Multer.File | Express.MulterS3.File,
              callback: (
                error: Error | null,
                info?: { path: string; filename: string },
              ) => void,
            ) => {
              // Use cloudinaryService's uploadFile method to upload the file
              cloudinaryService
                .uploadFile(file)
                .then((result) => {
                  // Call the callback with the file's path and filename
                  callback(null, {
                    path: result.secure_url,
                    filename: result.public_id,
                  });
                })
                .catch((error) => {
                  // Call the callback with an error if upload fails
                  callback(error);
                });
            };
            return {
              _handleFile: uploadResult,
            };
          },
        };
        return {
          fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
              return callback(
                new HttpException(
                  {
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                    errors: {
                      file: `cantUploadFileType`,
                    },
                  },
                  HttpStatus.UNPROCESSABLE_ENTITY,
                ),
              );
            }
            callback(null, true);
          },
          storage:
            storages[
              configService.getOrThrow('file.driver', { infer: true })
            ](),
          limits: {
            fileSize: configService.get('file.maxFileSize', { infer: true }),
          },
        };
      },
    }),
  ],
  exports: [FastifyMulterModule, SharedService],
  providers: [SharedService, IsUniqueOrAppend],
})
export class SharedModule {}
