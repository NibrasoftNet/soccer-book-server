import { AutoMap } from 'automapper-classes';
import { NotificationTypeOfSendingEnum } from '@/enums/notification/notification-type-of-sending.enum';
import { UserDto } from '@/domains/user/user.dto';
import { Expose } from 'class-transformer';

export class NotificationDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  title: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  message: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  forAllUsers: boolean;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  typeOfSending: NotificationTypeOfSendingEnum;

  @AutoMap(() => Date)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  punctualSendDate?: Date;

  @AutoMap(() => [Date])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  scheduledNotification: Date[] | null;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  active: boolean;

  @AutoMap(() => [UserDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  users?: [UserDto];

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  isNotificationSent: boolean;
}
