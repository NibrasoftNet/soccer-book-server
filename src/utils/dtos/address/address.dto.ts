import { Expose } from 'class-transformer';
import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';

export class AddressDto extends EntityHelperDto {
  @AutoMap()
  @Expose()
  id: string;

  @AutoMap()
  @Expose()
  country: string;

  @AutoMap()
  @Expose()
  city: string;

  @AutoMap()
  @Expose()
  longitude: number;

  @AutoMap()
  @Expose()
  latitude: number;

  @AutoMap()
  street: string;
}
