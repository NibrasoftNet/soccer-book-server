/* eslint-disable */
import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class InstantiableDto {
  public static async create(...args: any[]): Promise<any> {
    throw new HttpException(
      {
        status: HttpStatus.PRECONDITION_FAILED,
        errors: {
          validation: 'Method not implemented! Use derived class',
        },
      },
      HttpStatus.PRECONDITION_FAILED,
    );
  }
}

/* eslint-enable */
