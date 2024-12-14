import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { Complex } from '../entities/complex.entity';
import { ComplexDto } from '@/domains/complex/complex.dto';

export class ComplexSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Complex, ComplexDto);
    };
  }
}
