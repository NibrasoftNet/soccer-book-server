import { Module } from '@nestjs/common';
import { SubscriptionToTeamService } from './subscription-to-team.service';
import { SubscriptionToTeamController } from './subscription-to-team.controller';
import { SubscriptionToTeamSerializationProfile } from './serialization/subscription-to-team-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notification/notification.module';
import { SubscriptionToTeam } from './entities/subscription-to-team.entity';
import { Team } from '../team/entities/team.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionToTeam, Team]),
    UsersModule,
    NotificationModule,
  ],
  controllers: [SubscriptionToTeamController],
  providers: [
    SubscriptionToTeamService,
    SubscriptionToTeamSerializationProfile,
  ],
})
export class SubscriptionToTeamModule {}
