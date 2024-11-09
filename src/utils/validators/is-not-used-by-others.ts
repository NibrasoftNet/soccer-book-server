import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { HttpResponseException } from '../exceptions/http-response.exception';
import { I18nContext, I18nService } from 'nestjs-i18n';

type ValidationEntity = {
  id: number;
};

@Injectable()
@ValidatorConstraint({ name: 'IsNotUsedByOthers', async: true })
export class IsNotUsedByOthers implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    try {
      const repository = validationArguments.constraints[0] as string;
      const currentValue = validationArguments.object as ValidationEntity;
      console.log('validationArguments', currentValue.id);
      const entity = await this.dataSource
        .getRepository(repository)
        .createQueryBuilder('entity')
        .where('entity.id != :currentId', { currentId: currentValue.id })
        .andWhere(`entity.${validationArguments.property} = :value`, { value })
        .getOne();

      return !entity;
    } catch (error) {
      error.status = 422;
      throw new HttpResponseException(error);
    }
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const msg = validationArguments.constraints[1] as string;
    return this.i18n.t(msg, { lang: I18nContext.current()?.lang });
  }
}
