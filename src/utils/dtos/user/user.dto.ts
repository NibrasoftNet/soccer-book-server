import { Expose } from 'class-transformer';
import { AutoMap } from 'automapper-classes';
import { FileDto } from '@/domains/files/file.dto';
import { RoleDto } from '@/domains/role/role.dto';
import { StatusesDto } from '@/domains/status/statuses.dto';
import { AddressDto } from '@/domains/address/address.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';

export class UserDto extends EntityHelperDto {
  @AutoMap()
  @Expose()
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN'] })
  email: string;

  @AutoMap()
  firstName?: string;

  @AutoMap()
  @Expose()
  lastName?: string;

  @AutoMap(() => FileDto)
  @Expose()
  photo?: string;

  @AutoMap(() => RoleDto)
  role: string;

  @AutoMap(() => StatusesDto)
  status: string;

  @AutoMap(() => AddressDto)
  address: AddressDto;

  @AutoMap(() => Date)
  @Expose({ groups: ['admin'] })
  deletedAt: string;

  fullName: string;
}
