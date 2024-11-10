import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Team } from './entities/team.entity';
import { TeamSerializationProfile } from './serialization/team-serialization.profile';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([Team]), UsersModule, FilesModule],
  controllers: [TeamController],
  providers: [TeamService, TeamSerializationProfile],
})
export class TeamModule {}
