import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { HttpResponseException } from '../exceptions/http-response.exception';
import { AwsS3Service } from '../aws-s3/aws-s3.service';

@Injectable()
@ValidatorConstraint({ name: 'ImageExistsInS3Validator', async: true })
export class ImageExistsInS3Validator implements ValidatorConstraintInterface {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  async validate(imageUrl: string) {
    try {
      return await this.awsS3Service.checkIfFileExistsInS3(imageUrl);
    } catch (error) {
      error.status = 422;
      throw new HttpResponseException(error);
    }
  }

  defaultMessage(): string {
    return "image isn't uploaded";
  }
}
