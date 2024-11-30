import { HttpException, HttpStatus, ValidationError } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { ObjectLiteral, Repository } from 'typeorm';
import crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

export class Utils {
  static generateErrors(errors: ValidationError[]) {
    return errors.reduce(
      (accumulator, currentValue) => ({
        ...accumulator,
        [currentValue.property]:
          (currentValue.children?.length ?? 0) > 0
            ? this.generateErrors(currentValue.children ?? [])
            : Object.values(currentValue.constraints ?? {}).join(', '),
      }),
      {},
    );
  }

  /* eslint-disable */
  static async validateDtoOrFail<T extends Object>(dto: T): Promise<T> {
    /* eslint-enable */
    await validateOrReject(dto).catch((validationErrors: ValidationError[]) => {
      const errors = Utils.generateErrors(validationErrors);
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            validation: Object.values(errors).join('. ').trim(),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    });
    return dto;
  }

  static getKeyByValue<T>(myEnum: any, value: string) {
    const indexOfS = Object.values(myEnum).indexOf(value as unknown as T);
    return Object.keys(myEnum)[indexOfS];
  }

  static createRepositoryMock<T extends ObjectLiteral>(): Repository<T> {
    return <Repository<T>>Object.getOwnPropertyNames(
      Repository.prototype,
    ).reduce((acc, x) => {
      acc[x] = jest.fn();
      return acc;
    }, {});
  }

  static createSessionHash(): string {
    return crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
  }
}
