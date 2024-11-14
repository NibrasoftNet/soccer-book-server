import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AwsS3Service } from '../aws-s3/aws-s3.service';

@Injectable()
@ValidatorConstraint({ name: 'ImageExistsInS3Validator', async: true })
export class ImageExistsInS3Validator implements ValidatorConstraintInterface {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  async validate(imageUrl: string) {
    try {
      return await this.awsS3Service.checkIfFileExistsInS3(imageUrl);
    } catch (error) {
      throw new HttpException(
        `{"s3": "Fail to check if file exists in s3"}`,
        HttpStatus.PRECONDITION_FAILED,
      );
    }
  }

  defaultMessage(): string {
    return "image isn't uploaded";
  }
}
