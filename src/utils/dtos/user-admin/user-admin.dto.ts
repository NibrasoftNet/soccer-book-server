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
  @Expose()
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN'] })
  email: string;

  @AutoMap()
  userName?: string;

  @AutoMap(() => FileDto)
  @Expose()
  photo: FileDto;

  @AutoMap(() => RoleDto)
  role: string;

  @AutoMap(() => StatusesDto)
  status: string;

  @AutoMap(() => Date)
  @Expose({ groups: ['SUPERADMIN'] })
  deletedAt: string;

  @AutoMap(() => Date)
  subscriptionExpiryDate: Date;

  @AutoMap(() => [ComplexDto])
  complexes: Complex[];

  @AutoMap(() => UserSocketDto)
  socket: UserSocketDto;
}
