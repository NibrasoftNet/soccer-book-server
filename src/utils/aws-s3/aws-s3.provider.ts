import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export const AwsS3Provider: Provider = {
  provide: 'S3Client',
  useFactory: (configService: ConfigService) => {
    const accessKeyId = configService.getOrThrow<string>('file.accessKeyId', {
      infer: true,
    });
    const secretAccessKey = configService.getOrThrow<string>(
      'file.secretAccessKey',
      {
        infer: true,
      },
    );
    const region = configService.getOrThrow<string>('file.awsS3Region', {
      infer: true,
    });
    const bucket = configService.getOrThrow<string>('file.awsDefaultS3Bucket', {
      infer: true,
    });

    return {
      client: new S3Client({
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        region,
      }),
      bucket,
    };
  },
  inject: [ConfigService],
};
