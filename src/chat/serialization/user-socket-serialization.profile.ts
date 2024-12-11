import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { UserSocket } from '../entities/user-socket.entity';
import { UserSocketDto } from '@/domains/chat/user-socket.dto';

export class UserSocketSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, UserSocket, UserSocketDto);
    };
  }
}
