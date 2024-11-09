import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import {
  createMap,
  Mapper,
  MappingProfile,
  typeConverter,
} from 'automapper-core';
import { Notification } from '../entities/notification.entity';
import { NotificationDto } from '@/domains/notification/dto/notification.dto';

export class NotificationSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        Notification,
        NotificationDto,
        typeConverter(Date, String, (date) => date.toDateString()),
      );
    };
  }
}
