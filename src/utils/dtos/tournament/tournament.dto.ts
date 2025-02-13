import { AutoMap } from 'automapper-classes';
import { TournamentParticipationDto } from '@/domains/tournament-participation/tournament-participation.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { FileDto } from '@/domains/files/file.dto';
import { ComplexDto } from '@/domains/complex/complex.dto';
import { Expose } from 'class-transformer';
import { TournamentTypeEnum } from '@/enums/tournament/tournament-type.enum';

export class TournamentDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  name: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  description: string;

  @AutoMap(() => FileDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  image: FileDto;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  startDate: Date;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  finishDate: Date;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  lastSubscriptionDate: Date;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  numberOfTeams: number;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  totalJoinedTeams: number;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  type: TournamentTypeEnum;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  active: boolean;

  @AutoMap(() => ComplexDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  complex: ComplexDto;

  @AutoMap(() => [TournamentParticipationDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  participations: TournamentParticipationDto[];

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  price: number;
}
