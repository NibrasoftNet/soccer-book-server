import { AutoMap } from 'automapper-classes';
import { PlayerPositionEnum } from '@/enums/match-players/player-position.enum';
import { PlayerSideEnum } from '@/enums/match-players/player-side.enum';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserDto } from '@/domains/user/user.dto';
import { MatchDto } from '@/domains/match/match.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MatchPlayerDto extends EntityHelperDto {
  @ApiProperty()
  @AutoMap()
  id: number;

  @ApiProperty()
  @AutoMap(() => UserDto)
  user: UserDto;

  @ApiProperty()
  @AutoMap(() => MatchDto)
  match: MatchDto;

  @ApiProperty()
  @AutoMap()
  position: PlayerPositionEnum;

  @ApiProperty()
  @AutoMap()
  side: PlayerSideEnum;

  @ApiProperty()
  @AutoMap()
  accepted: boolean;

  @ApiProperty()
  @AutoMap()
  isOrganizer: boolean;

  @ApiProperty()
  @AutoMap()
  goals: number;
}
