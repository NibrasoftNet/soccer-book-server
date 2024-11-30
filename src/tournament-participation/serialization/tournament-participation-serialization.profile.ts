import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { TournamentParticipation } from '../entities/tournament-participation.entity';
import { TournamentParticipationDto } from '@/domains/tournament-participation/tournament-participation.dto';

export class TournamentParticipationSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, TournamentParticipation, TournamentParticipationDto);
    };
  }
}
