import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { TeammateParticipation } from '../entities/teammate-participation.entity';
import { TeammateParticipationDto } from '@/domains/teammate-paticipation/teammate-participation.dto';

export class TeammateParticipationSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, TeammateParticipation, TeammateParticipationDto);
    };
  }
}
