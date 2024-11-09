import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddressSeedService } from './address-seed.service';
import { Address } from '../../../address/entities/address.entity';
import { AddressFactory } from './address.factory';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressSeedService, AddressFactory],
  exports: [AddressSeedService, AddressFactory],
})
export class AddressSeedModule {}
