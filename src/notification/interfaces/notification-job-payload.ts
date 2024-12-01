import { NotificationMessageDto } from '@/domains/notification/notification-message.dto';

export interface NotificationJobPayload {
  message: NotificationMessageDto;
  notificationId: string;
}
