import { Injectable } from '@nestjs/common';

import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
  typeConverter,
} from 'automapper-core';
import { User } from '../entities/user.entity';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { UserDto } from '@/domains/user/user.dto';

@Injectable()
export class UserSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        User,
        UserDto,
        typeConverter(Date, String, (date) => date.toDateString()),
        forMember(
          (dto: UserDto) => dto.status,
          mapFrom((source: User) => source.status?.name),
        ),
        forMember(
          (dto: UserDto) => dto.photo,
          mapFrom((source: User) => source.photo?.path || null),
        ),
        forMember(
          (dto: UserDto) => dto.role,
          mapFrom((source: User) => source.role?.name),
        ),
      );
    };
  }
}
