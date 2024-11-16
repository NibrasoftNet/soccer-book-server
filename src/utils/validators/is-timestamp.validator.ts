import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { TimestampPrecision } from '@/enums/general/timestamp.enum';

@ValidatorConstraint({ name: 'IsTimestamp', async: false })
export class IsTimestampConstraint implements ValidatorConstraintInterface {
  /**
   * Validate whether the value is a valid UNIX timestamp in the specified precision.
   */
  validate(value: number, args: ValidationArguments): boolean {
    const [precision] = args.constraints;

    // Check if it's an integer
    if (!Number.isInteger(value)) {
      return false;
    }

    let date: Date;
    if (precision === TimestampPrecision.MILLISECONDS) {
      date = new Date(value); // Milliseconds are used directly
    } else if (precision === TimestampPrecision.SECONDS) {
      date = new Date(value * 1000); // Convert seconds to milliseconds
    } else {
      return false; // Unsupported precision
    }

    return date.getTime() > 0 && !isNaN(date.getTime());
  }

  /**
   * Default error message for invalid timestamps.
   */
  defaultMessage(args: ValidationArguments): string {
    const [precision] = args.constraints;
    return `${args.property} must be a valid UNIX timestamp in ${precision}.`;
  }
}

/**
 * Decorator to apply the IsTimestamp validator to a property.
 * @param precision - The timestamp precision (seconds or milliseconds).
 * @param validationOptions - Additional validation options.
 */
export function IsTimestamp(
  precision: TimestampPrecision,
  validationOptions?: ValidationOptions,
) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [precision],
      validator: IsTimestampConstraint,
    });
  };
}
