import { Module } from '@nestjs/common';
import { ComplexService } from './complex.service';
import { ComplexController } from './complex.controller';
import { ComplexSerializationProfile } from './serialization/complex-serialization.profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complex } from './entities/complex.entity';
import { UsersAdminModule } from '../users-admin/users-admin.module';
import { FilesModule } from '../files/files.module';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Complex]),
    UsersAdminModule,
    FilesModule,
    AddressModule,
  ],
  controllers: [ComplexController],
  providers: [ComplexService, ComplexSerializationProfile],
  exports: [ComplexService],
})
export class ComplexModule {}
