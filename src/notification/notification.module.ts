import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationSerializationProfile } from './serialization/notification-serialization.profile';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UsersModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationSerializationProfile],
  exports: [NotificationService],
})
export class NotificationModule {}
