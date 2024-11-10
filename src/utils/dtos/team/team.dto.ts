import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserDto } from '@/domains/user/user.dto';
import { FileDto } from '@/domains/files/file.dto';
import { SubscriptionToTeam } from '../../../subscription-to-team/entities/subscription-to-team.entity';
import { SubscriptionToTeamDto } from '@/domains/subscription-to-team/subscription-to-team.dto';

export class TeamDto extends EntityHelperDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name?: string;

  @AutoMap()
  bio?: string;

  @AutoMap()
  totalMembers: number;

  @AutoMap(() => FileDto)
  logo: FileDto;

  @AutoMap(() => UserDto)
  creator: UserDto;

  @AutoMap()
  active: boolean;

  @AutoMap()
  quantity: number;

  @AutoMap(() => [SubscriptionToTeamDto])
  members: SubscriptionToTeam[];
}
