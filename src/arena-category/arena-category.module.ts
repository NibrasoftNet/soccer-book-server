import { Module } from '@nestjs/common';
import { ArenaCategoryService } from './arena-category.service';
import { ArenaCategoryController } from './arena-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArenaCategory } from './entities/arena-category.entity';
import { FilesModule } from '../files/files.module';
import { ArenaCategorySerializationProfile } from './serialization/category-serialization.profile';

@Module({
  imports: [TypeOrmModule.forFeature([ArenaCategory]), FilesModule],
  controllers: [ArenaCategoryController],
  providers: [ArenaCategoryService, ArenaCategorySerializationProfile],
  exports: [ArenaCategoryService],
})
export class ArenaCategoryModule {}
