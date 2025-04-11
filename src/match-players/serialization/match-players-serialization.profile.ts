import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { MatchPlayerDto } from '@/domains/match-players/match-players.dto';
import { MatchPlayer } from '../entities/match-players.entity';

export class MatchPlayerSerialization extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, MatchPlayer, MatchPlayerDto);
    };
  }
}
