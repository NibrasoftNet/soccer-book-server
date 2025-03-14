import { Module } from '@nestjs/common';
import { TeammateService } from './teammate.service';
import { TeammateController } from './teammate.controller';
import { TeammateSerializationProfile } from './serialization/teammate-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Teammate } from './entities/teammate.entity';
import { ComplexModule } from '../complex/complex.module';

@Module({
  imports: [TypeOrmModule.forFeature([Teammate]), UsersModule, ComplexModule],
  controllers: [TeammateController],
  providers: [TeammateService, TeammateSerializationProfile],
  exports: [TeammateService],
})
export class TeammateModule {}
