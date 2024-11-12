import { Injectable } from '@nestjs/common';

import {
  createMap,
  forMember,
  mapFrom,
  Mapper,
  MappingProfile,
  typeConverter,
} from 'automapper-core';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { UserAdminDto } from '@/domains/user-admin/user-admin.dto';
import { UserAdmin } from '../entities/user-admin.entity';

@Injectable()
export class UsersAdminSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        UserAdmin,
        UserAdminDto,
        forMember(
          (dto: UserAdminDto) => dto.status,
          mapFrom((source: UserAdmin) => source.status?.name),
        ),
        forMember(
          (dto: UserAdminDto) => dto.role,
          mapFrom((source: UserAdmin) => source.role?.name),
        ),
        typeConverter(Date, String, (date) => date.toDateString()),
      );
    };
  }
}
