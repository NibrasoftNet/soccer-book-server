import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { UsersModule } from '../users/users.module';
import { ArenaModule } from '../arena/arena.module';
import { Reservation } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationSerializationProfileSerializationProfile } from './serialization/reservation-serialization.profile';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    UsersModule,
    ArenaModule,
    NotificationModule,
  ],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    ReservationSerializationProfileSerializationProfile,
  ],
  exports: [ReservationService],
})
export class ReservationModule {}
