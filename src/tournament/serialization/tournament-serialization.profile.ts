import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { Tournament } from '../entities/tournament.entity';
import { TournamentDto } from '@/domains/tournament/tournament.dto';

export class TournamentSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Tournament, TournamentDto);
    };
  }
}
