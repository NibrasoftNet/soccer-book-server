import { Expose } from 'class-transformer';
import { AutoMap } from 'automapper-classes';
import { FileDto } from '@/domains/files/file.dto';
import { RoleDto } from '@/domains/role/role.dto';
import { StatusesDto } from '@/domains/status/statuses.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';

export class UserAdminDto extends EntityHelperDto {
  @AutoMap()
  @Expose()
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN'] })
  email: string;

  @AutoMap()
  userName?: string;

  @AutoMap(() => FileDto)
  @Expose()
  photo?: string;

  @AutoMap(() => RoleDto)
  role: string;

  @AutoMap(() => StatusesDto)
  status: string;

  @AutoMap(() => Date)
  @Expose({ groups: ['SUPERADMIN'] })
  deletedAt: string;

  @AutoMap(() => Date)
  subscriptionExpiryDate: Date;
}
