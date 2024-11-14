import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';

type ValidationEntity =
  | {
      id?: number | string;
    }
  | undefined;

@Injectable()
@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsNotExist implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    try {
      const repository = validationArguments.constraints[0] as string;
      const currentValue = validationArguments.object as ValidationEntity;
      const entity = (await this.dataSource.getRepository(repository).findOne({
        where: {
          [validationArguments.property]: value,
        },
      })) as ValidationEntity;

      if (entity?.id === currentValue?.id) {
        return true;
      }

      return !entity;
    } catch (error) {
      throw new HttpException(
        `{"isNotExist": "Operation failed"}`,
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
  defaultMessage(validationArguments: ValidationArguments): string {
    const msg = validationArguments.constraints[1] as string;
    return this.i18n.t(msg, { lang: I18nContext.current()?.lang });
  }
}
