/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersAdminService } from './users-admin.service';
import { UsersAdminController } from './users-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';

import { UsersAdminSerializationProfile } from './serialization/user-admin-serialization.profile';
import { FilesModule } from '../files/files.module';
import { UserAdmin } from './entities/user-admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserAdmin]), FilesModule],
  controllers: [UsersAdminController],
  providers: [
    IsExist,
    IsNotExist,
    UsersAdminService,
    UsersAdminSerializationProfile,
  ],
  exports: [UsersAdminService],
})
export class UsersAdminModule {}
