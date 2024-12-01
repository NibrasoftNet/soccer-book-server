import { Injectable } from '@nestjs/common';
import { Task, TaskHandler } from 'nestjs-graphile-worker';
import { NotificationService } from '../../notification/notification.service';
import { WinstonLoggerService } from '../../logger/winston-logger.service';

@Injectable()
@Task('notification-cron')
export class NotificationCronTask {
  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly notificationService: NotificationService,
  ) {}

  @TaskHandler()
  async handler() {
    try {
      const notifications = await this.notificationService.findAllByDay();

      this.logger.info(`Notifications-cron-by-day`, {
        description: `Notifications cron by day`,
        class: 'NotificationCronTask',
        function: 'workerNotificationCronTask',
        response: notifications,
      });

      for (const notification of notifications) {
        await this.notificationService.sendProgrammedNotifications(
          notification.id,
          notification.scheduled_date,
        );
      }
    } catch (error) {
      this.logger.info(`Notifications-were-not-found`, {
        description: `Notifications were not found`,
        class: 'NotificationCronTask',
        function: 'workerNotificationCronTask',
        error: error,
      });
      throw error;
    }
  }
}
