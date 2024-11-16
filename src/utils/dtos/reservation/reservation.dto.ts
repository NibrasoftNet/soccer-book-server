import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserDto } from '@/domains/user/user.dto';
import { ArenaDto } from '@/domains/arena/arena.dto';
import { ReservationTypeEnum } from '@/enums/reservation/reservation-type.enum';

export class ReservationDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => UserDto)
  user: UserDto;

  @AutoMap(() => ArenaDto)
  arena: ArenaDto;

  @AutoMap(() => Date)
  day: Date;

  @AutoMap()
  startHour: string;

  @AutoMap()
  endHour: string;

  @AutoMap()
  status: ReservationTypeEnum;
}
