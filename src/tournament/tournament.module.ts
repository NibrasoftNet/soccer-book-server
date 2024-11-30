import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { ArenaModule } from '../arena/arena.module';
import { FilesModule } from '../files/files.module';
import { TournamentSerializationProfile } from './serialization/tournament-serialization.profile';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament]), ArenaModule, FilesModule],
  controllers: [TournamentController],
  providers: [TournamentService, TournamentSerializationProfile],
  exports: [TournamentService],
})
export class TournamentModule {}
