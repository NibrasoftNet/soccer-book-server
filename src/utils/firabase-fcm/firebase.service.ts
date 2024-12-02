import {
  Injectable,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class FirebaseMessagingService {
  private readonly messaging: firebaseAdmin.messaging.Messaging;
  private readonly logger = new Logger(FirebaseMessagingService.name);

  constructor(@Inject('FIREBASE_ADMIN') firebaseApp: firebaseAdmin.app.App) {
    this.messaging = firebaseApp.messaging();
  }

  async sendNotification(
    payload: firebaseAdmin.messaging.MulticastMessage,
  ): Promise<void> {
    try {
      const response = await this.messaging.sendEachForMulticast(payload);
      console.log('responce', response.responses[0].error);
      if (response.failureCount > 0) {
        this.logger.error('Notifications were not sent', {
          failureCount: response.failureCount,
          error: response.responses[0].error,
        });
        throw new HttpException(
          {
            status: HttpStatus.FAILED_DEPENDENCY,
            errors: {
              firebase: `Failed to send ${response.failureCount} notifications ${response.failureCount}.`,
            },
          },
          HttpStatus.FAILED_DEPENDENCY,
        );
      }
      this.logger.log('Notifications were sent successfully', {
        successCount: response.successCount,
      });
    } catch (error) {
      this.logger.error('Failed to send notifications', {
        error: error.message,
      });
      throw new HttpException(
        {
          status: HttpStatus.FAILED_DEPENDENCY,
          errors: {
            firebase: `Failed to send notifications: ${error.message}`,
          },
        },
        HttpStatus.FAILED_DEPENDENCY,
      );
    }
  }
}
