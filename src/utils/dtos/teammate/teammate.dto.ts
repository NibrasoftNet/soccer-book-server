import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '../general/entity-helper.dto';
import { UserDto } from '@/domains/user/user.dto';
import { Expose } from 'class-transformer';
import { ComplexDto } from '@/domains/complex/complex.dto';

export class TeammateDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap(() => UserDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  creator: UserDto;

  @AutoMap(() => ComplexDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  complex: ComplexDto;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  matchDateTime: Date;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  requiredPlayers: number;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  preferences: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  isFilled: boolean;
}
