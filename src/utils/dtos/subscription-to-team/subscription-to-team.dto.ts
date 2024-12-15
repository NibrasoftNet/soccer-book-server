import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { TeamDto } from '@/domains/team/team.dto';
import { UserDto } from '@/domains/user/user.dto';
import { SubscriptionToTeamStatusEnum } from '@/enums/subscription-to-team/subscription-to-team-status.enum';
import { Expose } from 'class-transformer';

export class SubscriptionToTeamDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap(() => TeamDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  team: TeamDto;

  @AutoMap(() => UserDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  applicant: UserDto;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  status: SubscriptionToTeamStatusEnum;
}
