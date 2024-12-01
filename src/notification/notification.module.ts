import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationSerializationProfile } from './serialization/notification-serialization.profile';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { NotificationRecipient } from './entities/notification-recipient.entity';
import { NotificationRecipientSerializationProfile } from './serialization/notification-recipient-serialization.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, NotificationRecipient]),
    UsersModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationSerializationProfile,
    NotificationRecipientSerializationProfile,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
