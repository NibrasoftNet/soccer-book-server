import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserSeedService } from './user-seed.service';
import { Address } from '../../../address/entities/address.entity';
import { UserFactory } from './user.factory';
import { Status } from '../../../statuses/entities/status.entity';
import { Role } from '../../../roles/entities/role.entity';
import { AddressSeedModule } from '../address/address-seed.module';
import { FileEntity } from '../../../files/entities/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Address, Status, Role, FileEntity]),
    AddressSeedModule,
  ],
  providers: [UserSeedService, UserFactory],
  exports: [UserSeedService, UserFactory],
})
export class UserSeedModule {}
