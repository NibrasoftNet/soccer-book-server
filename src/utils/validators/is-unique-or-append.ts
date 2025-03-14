import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
@ValidatorConstraint({ name: 'IsUniqueOrAppend', async: true })
export class IsUniqueOrAppend implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private readonly i18n: I18nService,
  ) {}

  async validate(
    value: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    const [appendSuffix = false] = validationArguments.constraints;
    console.log(validationArguments.constraints);
    try {
      const repository = validationArguments.constraints[0];
      const pathToProperty = validationArguments.constraints[1];
      let entity: unknown = await this.dataSource
        .getRepository(repository)
        .findOne({
          where: {
            [pathToProperty]: value,
          },
        });

      if (!entity) {
        return true; // Value is unique
      }

      if (appendSuffix) {
        const objectToUpdate = validationArguments.object as Record<
          string,
          unknown
        >;
        while (entity) {
          const suffix = customAlphabet('0123456789', 4)();
          value = `${value}-${suffix}`;
          entity = await this.dataSource.getRepository(repository).findOne({
            where: {
              [pathToProperty]: value,
            },
          });
        }

        // Modify the property in the DTO
        objectToUpdate[validationArguments.property] = value;
        return true;
      }

      return false; // Value is not unique
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

  defaultMessage(validationArguments: ValidationArguments): string {
    return `${validationArguments.property} ${this.i18n.t('validation.unique', { lang: I18nContext.current()?.lang })}`;
  }
}
