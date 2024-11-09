import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';
import { HttpResponseException } from '../exceptions/http-response.exception';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
@ValidatorConstraint({ name: 'IsExist', async: true })
export class IsExist implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    try {
      const repository = validationArguments.constraints[0];
      const pathToProperty = validationArguments.constraints[1];
      const entity: unknown = await this.dataSource
        .getRepository(repository)
        .findOne({
          where: {
            [pathToProperty]: value,
          },
        });
      return Boolean(entity);
    } catch (error) {
      error.status = 422;
      throw new HttpResponseException(error);
    }
  }
  defaultMessage(validationArguments: ValidationArguments): string {
    const msg = validationArguments.constraints[2] as string;
    return this.i18n.t(msg, { lang: I18nContext.current()?.lang });
  }
}
