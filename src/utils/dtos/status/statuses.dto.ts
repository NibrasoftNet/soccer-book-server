import { AutoMap } from 'automapper-classes';
import { Validate } from 'class-validator';
import { StatusCodeEnum } from '@/enums/status/statuses.enum';
import { IsExist } from '../../validators/is-exists.validator';

export class StatusesDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  @Validate(IsExist, ['Status', 'code', 'validation.statusNotExists'])
  code: StatusCodeEnum;
}
