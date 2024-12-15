import { ParticipationStatusEnum } from '@/enums/tournament-participation/participation-status.enum';
import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { TeamDto } from '@/domains/team/team.dto';
import { TournamentDto } from '@/domains/tournament/tournament.dto';
import { Expose } from 'class-transformer';

export class TournamentParticipationDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap(() => TournamentDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  tournament: TournamentDto;

  @AutoMap(() => TeamDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  team: TeamDto;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  status: ParticipationStatusEnum;
}
