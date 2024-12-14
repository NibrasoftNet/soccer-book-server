import { Module } from '@nestjs/common';
import { ArenaService } from './arena.service';
import { ArenaController } from './arena.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Arena } from './entities/arena.entity';
import { FilesModule } from '../files/files.module';
import { ArenaSerializationProfile } from './serialization/arena-serialization.profile';
import { AddressModule } from '../address/address.module';
import { ArenaCategoryModule } from '../arena-category/arena-category.module';
import { ComplexModule } from '../complex/complex.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Arena]),
    ComplexModule,
    FilesModule,
    AddressModule,
    ArenaCategoryModule,
  ],
  controllers: [ArenaController],
  providers: [ArenaService, ArenaSerializationProfile],
  exports: [ArenaService],
})
export class ArenaModule {}
