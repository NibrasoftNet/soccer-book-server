import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserDto } from '@/domains/user/user.dto';
import { FileDto } from '@/domains/files/file.dto';
import { SubscriptionToTeam } from '../../../subscription-to-team/entities/subscription-to-team.entity';
import { SubscriptionToTeamDto } from '@/domains/subscription-to-team/subscription-to-team.dto';
import { Expose } from 'class-transformer';
import { TeamReservationDto } from '@/domains/team-reservation/team-reservation.dto';

export class TeamDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: number;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  name?: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  bio?: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  totalMembers: number;

  @AutoMap(() => FileDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  logo: FileDto;

  @AutoMap(() => UserDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  creator: UserDto;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  active: boolean;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  quantity: number;

  @AutoMap(() => [SubscriptionToTeamDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  members: SubscriptionToTeam[];

  @AutoMap(() => [TeamReservationDto])
  homeReservation: TeamReservationDto[];

  @AutoMap(() => [TeamReservationDto])
  awayReservation: TeamReservationDto[];

  @AutoMap()
  winCount: number;

  @AutoMap()
  lossCount: number;
}
