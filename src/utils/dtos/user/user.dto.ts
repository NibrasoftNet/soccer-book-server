import { AutoMap } from 'automapper-classes';
import { FileDto } from '@/domains/files/file.dto';
import { RoleDto } from '@/domains/role/role.dto';
import { StatusesDto } from '@/domains/status/statuses.dto';
import { AddressDto } from '@/domains/address/address.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserSocketDto } from '@/domains/chat/user-socket.dto';

export class UserDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  userName: string;

  @AutoMap(() => FileDto)
  photo?: FileDto;

  @AutoMap(() => RoleDto)
  role: string;

  @AutoMap(() => StatusesDto)
  status: string;

  @AutoMap(() => AddressDto)
  address: AddressDto;

  @AutoMap(() => Date)
  deletedAt: string;

  @AutoMap(() => String)
  provider: string;

  @AutoMap(() => String)
  notificationsToken: string;

  @AutoMap(() => UserSocketDto)
  socket: UserSocketDto;
}
