import { AutoMap } from 'automapper-classes';
import { Validate } from 'class-validator';
import { IsExist } from '../../validators/is-exists.validator';

export class FileDto {
  @AutoMap()
  @Validate(IsExist, ['FileEntity', 'id', 'validation.imageNotExists'])
  id: string;

  @AutoMap()
  path: string;
}
