import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { MulterFile } from 'fastify-file-interceptor';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinary: any) {}

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

  // Optional method to delete a file from Cloudinary
  async deleteFile(publicId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.destroy(publicId, (error) => {
        if (error) {
          return reject(error);
        }
        resolve(); // Resolve on successful deletion
      });
    });
  }
}
