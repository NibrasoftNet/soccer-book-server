import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebaseAdmin from 'firebase-admin';
import { Task, TaskHandler } from 'nestjs-graphile-worker';
import { WinstonLoggerService } from '../../logger/winston-logger.service';
import { NotificationMessageDto } from '@/domains/notification/dto/notification-message.dto';

class FirebaseSingleton {
  private static instance: firebaseAdmin.app.App;

  public static getInstance(
    configService: ConfigService,
  ): firebaseAdmin.app.App {
    if (!FirebaseSingleton.instance) {
      try {
        FirebaseSingleton.instance = firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert({
            projectId: configService.get<string>(
              'FIREBASE_MESSAGING_PROJECT_ID',
              { infer: true },
            ),
            clientEmail: configService.get<string>(
              'FIREBASE_MESSAGING_CLIENT_EMAIL',
              { infer: true },
            ),
            privateKey: `-----BEGIN PRIVATE KEY-----${configService.get<string>(
              'FIREBASE_MESSAGING_PRIVATE_KEY',
              { infer: true },
            )}-----END PRIVATE KEY-----\n`,
          }),
        });
      } catch (error) {
        throw new Error(`Firebase initialization failed: ${error.message}`);
      }
    }
    return FirebaseSingleton.instance;
  }
}

@Injectable()
@Task('notification')
export class NotificationTask {
  private readonly messaging: firebaseAdmin.messaging.Messaging;

  constructor(
    private readonly logger: WinstonLoggerService,
    private readonly configService: ConfigService,
  ) {
    this.messaging = FirebaseSingleton.getInstance(
      this.configService,
    ).messaging();
  }

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
      const response = await this.messaging.sendEachForMulticast(
        payload.message,
      );
      if (response.failureCount > 0) {
        this.logger.info(`Notifications-were-not-sent`, {
          description: `Notifications were not sent`,
          class: 'NotificationTask',
          function: 'workerNotification',
          failureCount: response.failureCount,
        });
        throw new Error(
          `Failed to send ${response.failureCount} notifications.`,
        );
      } else {
        this.logger.info(`Notifications-were-sent-successfully`, {
          description: `Notifications were sent successfully`,
          class: NotificationTask.name,
          function: 'workerNotification',
          successCount: response.successCount,
        });
      }
    } catch (error) {
      this.logger.error(`Notification sending failed`, {
        description: `An error occurred while sending notifications`,
        class: NotificationTask.name,
        function: 'workerNotification',
        error: error.message,
      });
      throw error;
    }
  }
}
