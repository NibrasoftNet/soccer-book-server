import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Task, TaskHandler } from 'nestjs-graphile-worker';
import { WinstonLoggerService } from '../../logger/winston-logger.service';
import { NotificationMessageDto } from '@/domains/notification/notification-message.dto';
import { FirebaseMessagingService } from '../firabase-fcm/firebase.service';

@Injectable()
@Task('notification')
export class NotificationTask {
  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly configService: ConfigService,
    private readonly messagingService: FirebaseMessagingService,
  ) {}

  @TaskHandler()
  async handler(payload: {
    message: NotificationMessageDto;
    notificationId: string;
  }) {
    this.logger.info(`worker-Notification`, {
      description: `worker Notification`,
      class: NotificationTask.name,
      function: 'workerNotification',
      payload,
    });
    try {
      await this.messagingService.sendNotification(payload.message);
    } catch (error) {
      this.logger.error(`Notification sending failed`, {
        description: `An error occurred while sending notifications`,
        class: NotificationTask.name,
        function: 'workerNotification',
        error: error.message,
      });
      throw new HttpException(
        {
          status: HttpStatus.FAILED_DEPENDENCY,
          errors: {
            firebase: `Failed to send notifications.`,
          },
        },
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }
}
