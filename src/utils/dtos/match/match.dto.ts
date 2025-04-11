import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '../general/entity-helper.dto';
import { WinnerEnum } from '@/enums/team-reservation/winner.enum';
import { ReservationDto } from '@/domains/reservation/reservation.dto';
import { TeamReservationDto } from '@/domains/team-reservation/team-reservation.dto';
import { MatchPlayerDto } from '@/domains/match-players/match-players.dto';

export class MatchDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => ReservationDto)
  reservation: ReservationDto;

  @AutoMap(() => TeamReservationDto)
  teamReservation: TeamReservationDto;

  @AutoMap(() => MatchPlayerDto)
  players: MatchPlayerDto;

  @AutoMap()
  homeScore: number;

  @AutoMap()
  awayScore: number;

  @AutoMap()
  winner: WinnerEnum;
}
