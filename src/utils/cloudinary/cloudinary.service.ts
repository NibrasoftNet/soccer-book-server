import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { MulterFile } from 'fastify-file-interceptor';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: any,
    private readonly i18n: I18nService,
  ) {}

  async uploadFile(
    file: MulterFile | Express.MulterS3.File,
  ): Promise<UploadApiResponse> {
    const uploadOptions: UploadApiOptions = {
      folder: 'uploads', // Customize folder name
      resource_type: 'auto', // Automatically detect resource type (image, video, etc.)
    };

    try {
      return await new Promise((resolve, reject) => {
        const uploadStream = this.cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              return reject(error); // Reject on upload error
            }
            resolve(result); // Resolve with the upload result
          },
        );
        if (file.stream) {
          file.stream.pipe(uploadStream);
        } else {
          reject(
            new HttpException(
              {
                status: HttpStatus.PRECONDITION_FAILED,
                errors: {
                  file: 'File stream is not available.',
                },
              },
              HttpStatus.PRECONDITION_FAILED,
            ),
          );
        }
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            file: error.toString(),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
  }

  async deleteFile(imageUrl: string): Promise<boolean> {
    try {
      // Extract public ID from the URL
      const publicId = this.extractPublicId(imageUrl);

      if (!publicId) {
        new HttpException(
          {
            status: HttpStatus.PRECONDITION_FAILED,
            errors: {
              file: this.i18n.t('file.failedDelete', {
                lang: I18nContext.current()?.lang,
              }),
            },
          },
          HttpStatus.PRECONDITION_FAILED,
        );
      }

      // Use the Cloudinary uploader to destroy the file
      await new Promise<boolean | void>((resolve, reject) => {
        this.cloudinary.uploader.destroy(publicId, (error) => {
          if (error) {
            return reject(
              new HttpException(
                {
                  status: HttpStatus.BAD_REQUEST,
                  errors: {
                    file: `Failed to delete file: ${error.message}`,
                  },
                },
                HttpStatus.BAD_REQUEST,
              ),
            );
          }
          resolve();
        });
      });
      return true;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            file: error.toString(),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
  }

  private extractPublicId(imageUrl: string): string | null {
    const matches = imageUrl.match(/\/upload\/(?:v\d+\/)?([^.]+)/);
    return matches?.[1] || null;
  }
}
