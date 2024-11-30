import { isDefined } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

export const isDefinedValidator = (value: any) => {
  if (!isDefined(value)) {
    throw new HttpException(
      {
        status: HttpStatus.PRECONDITION_FAILED,
        errors: {
          validation: 'Undefined or Null input data',
        },
      },
      HttpStatus.PRECONDITION_FAILED,
    );
  }
};
