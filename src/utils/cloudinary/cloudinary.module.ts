// cloudinary.module.ts
import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Global()
@Module({
  providers: [
    CloudinaryService,
    CloudinaryProvider,
    /*    {
      provide: CloudinaryService,
      useFactory: (cloudinaryService: CloudinaryService) => {
        // Assuming you need the ConfigService to configure Cloudinary
        return cloudinaryService;
      },
      inject: [CloudinaryService],
    },*/
  ],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
