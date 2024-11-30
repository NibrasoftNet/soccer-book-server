import {
  Injectable,
  PipeTransform,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';

export const IsCreatorPipe = (
  entityName: string,
  entityKey: string,
  relation: string,
) => {
  @Injectable()
  class IsOwnerPipeMixin implements PipeTransform {
    constructor(
      @InjectDataSource() readonly dataSource: DataSource,
      @Inject(REQUEST) readonly request,
      readonly i18n: I18nService,
    ) {}

    async transform(value: string): Promise<any> {
      if (!value) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            errors: {
              password: `${entityKey} is missing`,
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Access the user ID from the request
      const userId = this.request.user.id;
      // Get the repository dynamically based on the entity name
      const repository: Repository<any> =
        this.dataSource.getRepository(entityName);

      // Find the entity including the specified relation (e.g., creator)
      const entity = await repository.findOne({
        where: { [entityKey]: value },
        relations: [relation],
      });

      if (!entity) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            errors: {
              auth: `${entityName} with ${entityKey} ${value} not found`,
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if the authenticated user's ID matches the related field (e.g., creator.id)
      const relatedEntity = (entity as any)[relation];
      if (!relatedEntity || relatedEntity.id !== userId) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            errors: {
              auth: this.i18n.t('auth.userNotAllowed', {
                lang: I18nContext.current()?.lang,
              }),
            },
          },
          HttpStatus.FORBIDDEN,
        );
      }

      // Return the original value if ownership is confirmed
      return value;
    }
  }
  return IsOwnerPipeMixin;
};
