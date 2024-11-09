import { AutoMap } from 'automapper-classes';
import { NotificationTypeOfSendingEnum } from '@/enums/notification/notification-type-of-sending.enum';
import { UserDto } from '@/domains/user/user.dto';

export class NotificationDto {
  @AutoMap()
  id: string;

  @AutoMap()
  title: string;

  @AutoMap()
  message: string;

  @AutoMap()
  forAllUsers: boolean;

  @AutoMap()
  typeOfSending: NotificationTypeOfSendingEnum;

  @AutoMap(() => Date)
  punctualSendDate?: Date;

  @AutoMap(() => [Date])
  scheduledNotification: Date[] | null;

  @AutoMap()
  active: boolean;

  @AutoMap(() => [UserDto])
  users?: [UserDto];

  @AutoMap()
  isNotificationSent: boolean;
}
