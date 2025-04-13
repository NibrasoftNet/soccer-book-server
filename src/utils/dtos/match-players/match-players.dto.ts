import { AutoMap } from 'automapper-classes';
import { PlayerPositionEnum } from '@/enums/match-players/player-position.enum';
import { PlayerSideEnum } from '@/enums/match-players/player-side.enum';
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
  position: PlayerPositionEnum;

  @AutoMap()
  side: PlayerSideEnum;

  @AutoMap()
  accepted: boolean;

  @AutoMap()
  isOrganizer: boolean;

  @AutoMap()
  goals: number;
}
