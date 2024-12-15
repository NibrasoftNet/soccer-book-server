import { Expose } from 'class-transformer';
import { AutoMap } from 'automapper-classes';
import { FileDto } from '@/domains/files/file.dto';
import { RoleDto } from '@/domains/role/role.dto';
import { StatusesDto } from '@/domains/status/statuses.dto';
import { AddressDto } from '@/domains/address/address.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserSocketDto } from '@/domains/chat/user-socket.dto';

export class UserDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  email: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  userName: string;

  @AutoMap(() => FileDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  photo?: FileDto;

  @AutoMap(() => RoleDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  role: string;

  @AutoMap(() => StatusesDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  status: string;

  @AutoMap(() => AddressDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  address: AddressDto;

  @AutoMap(() => Date)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  deletedAt: string;

  @AutoMap(() => String)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  notificationsToken: string;

  @AutoMap(() => UserSocketDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  socket: UserSocketDto;
}
