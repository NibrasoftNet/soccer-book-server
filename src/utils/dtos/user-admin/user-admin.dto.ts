import { Expose } from 'class-transformer';
import { AutoMap } from 'automapper-classes';
import { FileDto } from '@/domains/files/file.dto';
import { RoleDto } from '@/domains/role/role.dto';
import { StatusesDto } from '@/domains/status/statuses.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { Complex } from '../../../complex/entities/complex.entity';
import { ComplexDto } from '@/domains/complex/complex.dto';
import { UserSocketDto } from '@/domains/chat/user-socket.dto';

export class UserAdminDto extends EntityHelperDto {
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
  photo: FileDto;

  @AutoMap(() => RoleDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  role: string;

  @AutoMap(() => StatusesDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  status: string;

  @AutoMap(() => Date)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  deletedAt: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  notificationsToken: string;

  @AutoMap(() => Date)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  subscriptionExpiryDate: Date;

  @AutoMap(() => [ComplexDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  complexes: Complex[];

  @AutoMap(() => UserSocketDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  socket: UserSocketDto;
}
