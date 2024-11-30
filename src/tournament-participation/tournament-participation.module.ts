import { Module } from '@nestjs/common';
import { TournamentParticipationService } from './tournament-participation.service';
import { TournamentParticipationController } from './tournament-participation.controller';
import { TournamentModule } from '../tournament/tournament.module';
import { TeamModule } from '../team/team.module';
import { TournamentParticipation } from './entities/tournament-participation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TournamentParticipationSerializationProfile } from './serialization/tournament-participation-serialization.profile';

@Module({
  imports: [
    TypeOrmModule.forFeature([TournamentParticipation]),
    TournamentModule,
    TeamModule,
  ],
  controllers: [TournamentParticipationController],
  providers: [
    TournamentParticipationService,
    TournamentParticipationSerializationProfile,
  ],
})
export class TournamentParticipationModule {}
