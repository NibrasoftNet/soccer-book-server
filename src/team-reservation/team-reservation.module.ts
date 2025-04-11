import { Module } from '@nestjs/common';
import { TeamReservationService } from './team-reservation.service';
import { TeamReservationController } from './team-reservation.controller';
import { ArenaModule } from '../arena/arena.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';
import { TeamReservationSerialization } from './serialization/team-reservation-serialization.profile';
import { TeamModule } from '../team/team.module';
import { TeamReservation } from './entities/team-reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamReservation]),
    TeamModule,
    ArenaModule,
    NotificationModule,
  ],
  controllers: [TeamReservationController],
  providers: [TeamReservationService, TeamReservationSerialization],
  exports: [TeamReservationService],
})
export class TeamReservationModule {}
