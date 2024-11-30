import {
  Injectable,
  PipeTransform,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
export const IsExistsPipe = (entityName: string, entityKey: string) => {
  @Injectable()
  class IsExistPipeMixinPipe implements PipeTransform<any, Promise<any>> {
    constructor(@InjectDataSource() readonly dataSource: DataSource) {}
    async transform(entityItem: any): Promise<any> {
      if (entityItem) {
        const repository = await this.dataSource
          .getRepository(entityName)
          .findOne({
            where: {
              [entityKey]: entityItem,
            },
          });

        if (!repository) {
          throw new HttpException(
            {
              status: HttpStatus.PRECONDITION_FAILED,
              errors: {
                auth: `${entityName} with ${entityKey} ${entityItem} not found`,
              },
            },
            HttpStatus.PRECONDITION_FAILED,
          );
        }
        return entityItem;
      }
    }
  }
  return IsExistPipeMixinPipe;
};
