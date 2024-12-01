import { AutoMap } from 'automapper-classes';
import { NotificationDto } from '@/domains/notification/notification.dto';
import { UserDto } from '@/domains/user/user.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';

export class NotificationRecipientDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => NotificationDto)
  notification: NotificationDto;

  @AutoMap(() => UserDto)
  user: UserDto;

  @AutoMap()
  isRead: boolean;

  @AutoMap()
  readAt: Date;
}
