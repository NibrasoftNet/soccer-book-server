import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { TeamDto } from '@/domains/team/team.dto';
import { UserDto } from '@/domains/user/user.dto';
import { SubscriptionToTeamStatusEnum } from '@/enums/subscription-to-team/subscription-to-team-status.enum';

export class SubscriptionToTeamDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => TeamDto)
  team: TeamDto;

  @AutoMap(() => UserDto)
  applicant: UserDto;

  @AutoMap()
  status: SubscriptionToTeamStatusEnum;
}
