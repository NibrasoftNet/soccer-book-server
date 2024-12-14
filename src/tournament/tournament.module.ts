import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from './entities/tournament.entity';
import { FilesModule } from '../files/files.module';
import { TournamentSerializationProfile } from './serialization/tournament-serialization.profile';
import { ComplexModule } from '../complex/complex.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament]), ComplexModule, FilesModule],
  controllers: [TournamentController],
  providers: [TournamentService, TournamentSerializationProfile],
  exports: [TournamentService],
})
export class TournamentModule {}
