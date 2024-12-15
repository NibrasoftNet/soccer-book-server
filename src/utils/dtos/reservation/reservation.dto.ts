import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserDto } from '@/domains/user/user.dto';
import { ArenaDto } from '@/domains/arena/arena.dto';
import { ReservationTypeEnum } from '@/enums/reservation/reservation-type.enum';
import { Expose } from 'class-transformer';

export class ReservationDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap(() => UserDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  user: UserDto;

  @AutoMap(() => ArenaDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  arena: ArenaDto;

  @AutoMap(() => Date)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  day: Date;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  startHour: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  endHour: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  status: ReservationTypeEnum;
}
