import { Column, Entity, PrimaryColumn } from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { RoleCodeEnum } from '@/enums/role/roles.enum';

@Entity()
export class Role extends EntityHelper {
  @PrimaryColumn()
  id: number;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ default: RoleCodeEnum.USER })
  code: RoleCodeEnum;
}
