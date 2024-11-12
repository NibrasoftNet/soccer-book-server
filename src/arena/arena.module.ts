import { Module } from '@nestjs/common';
import { ArenaService } from './arena.service';
import { ArenaController } from './arena.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arena } from './entities/arena.entity';
import { FilesModule } from '../files/files.module';
import { ArenaSerializationProfile } from './serialization/arena-serialization.profile';
import { UsersAdminModule } from '../users-admin/users-admin.module';
import { AddressModule } from '../address/address.module';
import { ArenaCategoryModule } from '../arena-category/arena-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Arena]),
    UsersAdminModule,
    FilesModule,
    AddressModule,
    ArenaCategoryModule,
  ],
  controllers: [ArenaController],
  providers: [ArenaService, ArenaSerializationProfile],
  exports: [ArenaService],
})
export class ArenaModule {}
