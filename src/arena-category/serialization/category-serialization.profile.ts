import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { ArenaCategory } from '../entities/arena-category.entity';
import { ArenaCategoryDto } from '@/domains/area-category/arena-category.dto';

export class ArenaCategorySerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, ArenaCategory, ArenaCategoryDto);
    };
  }
}
