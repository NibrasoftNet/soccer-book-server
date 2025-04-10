import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserAdminDto } from '@/domains/user-admin/user-admin.dto';
import { AddressDto } from '@/domains/address/address.dto';
import { FileDto } from '@/domains/files/file.dto';
import { ArenaDto } from '@/domains/arena/arena.dto';
import { TournamentDto } from '@/domains/tournament/tournament.dto';
import { Expose } from 'class-transformer';

export class ComplexDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  name: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  description: string;

  @AutoMap(() => UserAdminDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  creator: UserAdminDto;

  @AutoMap(() => AddressDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  address: AddressDto;

  @AutoMap(() => FileDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  image: FileDto;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  openTime: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  closeTime: string;

  @AutoMap(() => [ArenaDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  arenas: ArenaDto[];

  @AutoMap(() => [TournamentDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  tournaments: TournamentDto[];

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  active: boolean;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  referee: boolean;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  water: boolean;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  shower: boolean;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  parking: boolean;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  room: boolean;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  recording: boolean;
}
