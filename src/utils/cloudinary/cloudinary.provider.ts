import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.getOrThrow<string>('cloudinary.cloudName', {
        infer: true,
      }),
      api_key: configService.getOrThrow<string>('cloudinary.apiKey', {
        infer: true,
      }),
      api_secret: configService.getOrThrow<string>('cloudinary.apiSecret', {
        infer: true,
      }),
    });
    return cloudinary;
  },
  inject: [ConfigService],
};
