import { ParticipationStatusEnum } from '@/enums/tournament-participation/participation-status.enum';
import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { TeamDto } from '@/domains/team/team.dto';
import { TournamentDto } from '@/domains/tournament/tournament.dto';

export class TournamentParticipationDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => TournamentDto)
  tournament: TournamentDto;

  @AutoMap(() => TeamDto)
  team: TeamDto;

  @AutoMap()
  status: ParticipationStatusEnum;
}
