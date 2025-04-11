import { Module } from '@nestjs/common';
import { MatchPlayersService } from './match-players.service';
import { MatchPlayersController } from './match-players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '../notification/notification.module';
import { MatchPlayerSerialization } from './serialization/match-players-serialization.profile';
import { UsersModule } from '../users/users.module';
import { MatchPlayer } from './entities/match-players.entity';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchPlayer]),
    UsersModule,
    MatchModule,
    NotificationModule,
  ],
  controllers: [MatchPlayersController],
  providers: [MatchPlayersService, MatchPlayerSerialization],
  exports: [MatchPlayersService],
})
export class MatchPlayersModule {}
