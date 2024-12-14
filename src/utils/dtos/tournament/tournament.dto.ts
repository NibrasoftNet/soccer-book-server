import { AutoMap } from 'automapper-classes';
import { TournamentParticipationDto } from '@/domains/tournament-participation/tournament-participation.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { FileDto } from '@/domains/files/file.dto';
import { ComplexDto } from '@/domains/complex/complex.dto';

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

  @AutoMap(() => ComplexDto)
  complex: ComplexDto;

  @AutoMap(() => [TournamentParticipationDto])
  participations: TournamentParticipationDto[];

  @AutoMap()
  price: number;
}
