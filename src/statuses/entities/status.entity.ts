import { Column, Entity, PrimaryColumn } from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { StatusCodeEnum } from '@/enums/status/statuses.enum';

@Entity()
export class Status extends EntityHelper {
  @AutoMap()
  @PrimaryColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ default: StatusCodeEnum.INACTIVE })
  code: StatusCodeEnum;
}
