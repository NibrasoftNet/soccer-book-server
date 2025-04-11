import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { TeamReservation } from '../entities/team-reservation.entity';
import { TeamReservationDto } from '@/domains/team-reservation/team-reservation.dto';

export class TeamReservationSerialization extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, TeamReservation, TeamReservationDto);
    };
  }
}
