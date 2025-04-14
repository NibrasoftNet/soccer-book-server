import { AutoMap } from 'automapper-classes';
import {
  PlayerSideEnum,
  PlayerInvitationStatusEnum,
  PlayerMatchEnum,
} from '@/enums/match-players/player-match.enum';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserDto } from '@/domains/user/user.dto';
import { MatchDto } from '@/domains/match/match.dto';

export class MatchPlayerDto extends EntityHelperDto {
  @AutoMap()
  id: number;

  @AutoMap(() => UserDto)
  user: UserDto;

  @AutoMap(() => MatchDto)
  match: MatchDto;

  @AutoMap()
  position: PlayerMatchEnum;

  @AutoMap()
  side: PlayerSideEnum;

  @AutoMap()
  accepted: PlayerInvitationStatusEnum;

  @AutoMap()
  isOrganizer: boolean;

  @AutoMap()
  goals: number;
}
