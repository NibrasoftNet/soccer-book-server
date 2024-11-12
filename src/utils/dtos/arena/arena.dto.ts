import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { ArenaCategoryDto } from '@/domains/area-category/arena-category.dto';
import { AddressDto } from '@/domains/address/address.dto';
import { FileDto } from '@/domains/files/file.dto';
import { UserAdminDto } from '@/domains/user-admin/user-admin.dto';

export class ArenaDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  description: string;

  @AutoMap(() => UserAdminDto)
  userAdmin: UserAdminDto;

  @AutoMap(() => ArenaCategoryDto)
  category: ArenaCategoryDto;

  @AutoMap(() => AddressDto)
  address: AddressDto;

  @AutoMap(() => [FileDto])
  image: FileDto[];

  @AutoMap()
  active: boolean;

  @AutoMap()
  length: number;

  @AutoMap()
  width: number;

  @AutoMap()
  openTime: string;

  @AutoMap()
  closeTime: string;
}
