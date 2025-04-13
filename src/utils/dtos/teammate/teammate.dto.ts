import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '../general/entity-helper.dto';
import { UserDto } from '@/domains/user/user.dto';
import { Expose } from 'class-transformer';
import { ReservationDto } from '@/domains/reservation/reservation.dto';
import { TeammateParticipationDto } from '@/domains/teammate-paticipation/teammate-participation.dto';

export class TeammateDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap(() => UserDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  creator: UserDto;

  @AutoMap(() => ReservationDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  reservation: ReservationDto;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  requiredPlayers: number;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  totalAccepted: number;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  preferences: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  isFilled: boolean;

  @AutoMap(() => [TeammateParticipationDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  participations: TeammateParticipationDto[];

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  active: boolean;
}
