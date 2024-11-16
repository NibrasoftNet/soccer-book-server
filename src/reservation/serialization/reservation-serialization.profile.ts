import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { Reservation } from '../entities/reservation.entity';
import { ReservationDto } from '@/domains/reservation/reservation.dto';

export class ReservationSerializationProfileSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Reservation, ReservationDto);
    };
  }
}
