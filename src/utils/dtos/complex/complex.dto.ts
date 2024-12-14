import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserAdminDto } from '@/domains/user-admin/user-admin.dto';
import { AddressDto } from '@/domains/address/address.dto';
import { FileDto } from '@/domains/files/file.dto';
import { ArenaDto } from '@/domains/arena/arena.dto';
import { TournamentDto } from '@/domains/tournament/tournament.dto';

export class ComplexDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap(() => UserAdminDto)
  creator: UserAdminDto;

  @AutoMap(() => AddressDto)
  address: AddressDto;

  @AutoMap(() => FileDto)
  image: FileDto;

  @AutoMap()
  openTime: string;

  @AutoMap()
  closeTime: string;

  @AutoMap(() => [ArenaDto])
  arenas: ArenaDto[];

  @AutoMap(() => [TournamentDto])
  tournaments: TournamentDto[];
}
