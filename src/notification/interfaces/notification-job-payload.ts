import { NotificationMessageDto } from '@/domains/notification/dto/notification-message.dto';

export interface NotificationJobPayload {
  message: NotificationMessageDto;
  notificationId: string;
}
