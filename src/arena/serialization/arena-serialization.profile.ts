import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { Arena } from '../entities/arena.entity';
import { ArenaDto } from '@/domains/arena/arena.dto';

export class ArenaSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Arena, ArenaDto);
    };
  }
}
