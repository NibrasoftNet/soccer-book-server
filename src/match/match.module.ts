import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';
import { Match } from './entities/match.entity';
import { ReservationModule } from '../reservation/reservation.module';
import { MatchSerializationProfile } from './serialization/match-serialization.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match]),
    ReservationModule,
    NotificationModule,
  ],
  controllers: [MatchController],
  providers: [MatchService, MatchSerializationProfile],
  exports: [MatchService],
})
export class MatchModule {}
