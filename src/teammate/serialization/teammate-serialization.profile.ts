import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { TeammateDto } from '@/domains/teammate/teammate.dto';
import { Teammate } from '../entities/teammate.entity';

export class TeammateSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Teammate, TeammateDto);
    };
  }
}
