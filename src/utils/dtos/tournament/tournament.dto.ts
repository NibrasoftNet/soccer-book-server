import { AutoMap } from 'automapper-classes';
import { ArenaDto } from '@/domains/arena/arena.dto';
import { TournamentParticipationDto } from '@/domains/tournament-participation/tournament-participation.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { FileDto } from '@/domains/files/file.dto';

export class TournamentDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap(() => FileDto)
  image: FileDto;

  @AutoMap()
  startDate: Date;

  @AutoMap()
  finishDate: Date;

  @AutoMap()
  lastSubscriptionDate: Date;

  @AutoMap()
  numberOfTeams: number;

  @AutoMap()
  totalJoinedTeams: number;

  @AutoMap()
  active: boolean;

  @AutoMap(() => ArenaDto)
  arena: ArenaDto;

  @AutoMap(() => [TournamentParticipationDto])
  participations: TournamentParticipationDto[];

  @AutoMap()
  price: number;
}
