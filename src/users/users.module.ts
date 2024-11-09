/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { Address } from '../address/entities/address.entity';

import { AddressModule } from '../address/address.module';
import { UserSerializationProfile } from './serialization/user-serialization.profile';
import { AddressService } from 'src/address/address.service';
import { Role } from 'src/roles/entities/role.entity';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Address]),
    AddressModule,
    FilesModule,
  ],
  controllers: [UsersController],
  providers: [
    IsExist,
    IsNotExist,
    UsersService,
    AddressService,
    UserSerializationProfile,
  ],
  exports: [UsersService],
})
export class UsersModule {}
