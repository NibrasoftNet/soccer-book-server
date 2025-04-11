import { AutoMap } from 'automapper-classes';
import { ReservationTypeEnum } from '@/enums/reservation/reservation-type.enum';
import { EntityHelperDto } from '../general/entity-helper.dto';
import { ArenaDto } from '@/domains/arena/arena.dto';
import { TeamDto } from '@/domains/team/team.dto';
import { WinnerEnum } from '@/enums/team-reservation/winner.enum';

export class TeamReservationDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => ArenaDto)
  arena: ArenaDto;

  @AutoMap(() => TeamDto)
  home: TeamDto;

  @AutoMap()
  homeScore: number;

  @AutoMap(() => TeamDto)
  away: TeamDto;

  @AutoMap()
  awayScore: number;

  @AutoMap()
  winner: WinnerEnum;

  @AutoMap()
  day: Date;

  @AutoMap()
  startHour: string;

  @AutoMap()
  endHour: string;

  @AutoMap()
  status: ReservationTypeEnum;
}
