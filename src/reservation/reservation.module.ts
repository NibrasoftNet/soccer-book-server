import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { UsersModule } from '../users/users.module';
import { ArenaModule } from '../arena/arena.module';
import { Reservation } from './entities/reservation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationSerializationProfileSerializationProfile } from './serialization/reservation-serialization.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation]), UsersModule, ArenaModule],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    ReservationSerializationProfileSerializationProfile,
  ],
})
export class ReservationModule {}
