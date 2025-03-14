import { Module } from '@nestjs/common';
import { TeammateParticipationService } from './teammate-participation.service';
import { TeammateParticipationController } from './teammate-participation.controller';
import { TeammateParticipationSerializationProfile } from './serialization/teammate-participation-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeammateParticipation } from './entities/teammate-participation.entity';
import { TeammateModule } from '../teammate/teammate.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeammateParticipation]),
    TeammateModule,
    UsersModule,
  ],
  controllers: [TeammateParticipationController],
  providers: [
    TeammateParticipationService,
    TeammateParticipationSerializationProfile,
  ],
})
export class TeammateParticipationModule {}
