import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { HttpException, HttpStatus } from '@nestjs/common';

@ValidatorConstraint({ name: 'EndLaterThanStartDateValidator', async: true })
export class EndLaterThanStartDateValidator
  implements ValidatorConstraintInterface
{
  validate(date: Date, args: ValidationArguments) {
    try {
      const startDateAttribute = args.constraints[0];
      return date > args.object[startDateAttribute];
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            validation: error,
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
  }

  defaultMessage(): string {
    return `End date should be later than start date`;
  }
}
