import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  HeadObjectCommandInput,
  HeadObjectCommandOutput,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(
    @Inject('S3Client') s3Provider: { client: S3Client; bucket: string },
    private readonly i18n: I18nService,
  ) {
    this.s3Client = s3Provider.client;
    this.bucket = s3Provider.bucket;
  }

  private extractKeyFromUrl(url: string): string {
    const urlParts = new URL(url);
    return decodeURIComponent(urlParts.pathname.slice(1));
  }

  async getFileFromBucketByUrl(url: string): Promise<string> {
    const key = this.extractKeyFromUrl(url);
    return await this.getFileFromBucket(key);
  }

  async getFileFromBucket(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const response = await this.s3Client.send(command);

    if (!response.Body) {
      throw new HttpException(
        `{"file":"${this.i18n.t('file.failedUpload', { lang: I18nContext.current()?.lang })}"}`,
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    return await new Promise((resolve, reject) => {
      const chunks: any = [];
      if (response.Body instanceof Readable) {
        response.Body.on('data', (chunk) => chunks.push(chunk));
        response.Body.on('end', () =>
          resolve(Buffer.concat(chunks).toString('base64')),
        );
        response.Body.on('error', reject);
      }
    });
  }

  /**
   * Upload or update file in aws s3 bucket
   * @returns {Promise<boolean>} success upload/update of the file
   * @param {string} key aws s3 file key
   * @param {Buffer | Uint8Array | Blob | string} body file content
   * @param {string} contentType file content type
   */
  async uploadToS3Bucket(
    key: string,
    body: Buffer | Uint8Array | Blob | string,
    contentType: string,
  ): Promise<boolean> {
    const input = {
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ACL: ObjectCannedACL.public_read_write,
      ContentType: contentType,
    };
    const command = new PutObjectCommand(input);
    const awsResponse = await this.s3Client.send(command);

    if (
      !(
        awsResponse['$metadata'] &&
        awsResponse['$metadata'].httpStatusCode === 200
      )
    ) {
      throw new HttpException(
        `{"file": "${this.i18n.t('file.failedUpload', { lang: I18nContext.current()?.lang })}"}`,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return true;
  }

  /**
   * Delete file from aws s3 bucket
   * @returns {Promise<boolean>} success deletion of the file
   * @param {string} key aws s3 file key
   */
  async deleteFromS3Bucket(key: string): Promise<boolean> {
    const input = {
      Bucket: this.bucket,
      VersioningConfiguration: {
        MFADelete: 'Enabled',
        Status: 'Enabled',
      },
      Key: key,
      ACL: ObjectCannedACL.public_read_write,
    };
    const command = new DeleteObjectCommand(input);
    const awsResponse = await this.s3Client.send(command);
    console.log('dsfgdafgasd', awsResponse);
    if (
      !(
        awsResponse['$metadata'] &&
        awsResponse['$metadata'].httpStatusCode === 204
      )
    ) {
      throw new HttpException(
        `{"file":"${this.i18n.t('file.failedUpload', { lang: I18nContext.current()?.lang })}"}`,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return true;
  }

  async checkIfFileExistsInS3(url: string): Promise<boolean> {
    try {
      const bucketParams: HeadObjectCommandInput = {
        Bucket: this.bucket,
        Key: this.extractKeyFromUrl(url),
      };
      const cmd = new HeadObjectCommand(bucketParams);
      const data: HeadObjectCommandOutput = await this.s3Client.send(cmd);
      return data.$metadata.httpStatusCode === 200;
    } catch (error) {
      if (error.$metadata?.httpStatusCode === 404) {
        // doesn't exist and permission policy includes s3:ListBucket
        return false;
      } else if (error.$metadata?.httpStatusCode === 403) {
        // doesn't exist, permission policy WITHOUT s3:ListBucket
        return false;
      } else {
        throw new HttpException(
          `{"auth": "Fialed to check if file exists in s3 bucket"}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
