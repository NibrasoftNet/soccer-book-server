import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '../general/entity-helper.dto';
import { UserDto } from '@/domains/user/user.dto';
import { ArenaDto } from '@/domains/arena/arena.dto';

export class TeammateDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => UserDto)
  creator: UserDto;

  @AutoMap(() => ArenaDto)
  arena: ArenaDto;

  @AutoMap()
  matchDateTime: Date;

  @AutoMap()
  requiredPlayers: number;

  @AutoMap()
  preferences: string;

  @AutoMap()
  isFilled: boolean;
}
