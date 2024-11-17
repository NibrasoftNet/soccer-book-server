import { Module } from '@nestjs/common';
import { TeammateService } from './teammate.service';
import { TeammateController } from './teammate.controller';
import { TeammateSerializationProfile } from './serialization/teammate-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { ArenaModule } from '../arena/arena.module';
import { Teammate } from './entities/teammate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teammate]), UsersModule, ArenaModule],
  controllers: [TeammateController],
  providers: [TeammateService, TeammateSerializationProfile],
})
export class TeammateModule {}
