import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { arenaCategoryPaginationConfig } from './config/arena-category-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { FilesService } from '../files/files.service';
import { ArenaCategory } from './entities/arena-category.entity';
import { CreateArenaCategoryDto } from '@/domains/area-category/create-arena-category.dto';
import { UpdateArenaCategoryDto } from '@/domains/area-category/update-arena-category.dto';

@Injectable()
export class ArenaCategoryService {
  constructor(
    @InjectRepository(ArenaCategory)
    private readonly categoryRepository: Repository<ArenaCategory>,
    private readonly fileService: FilesService,
  ) {}
  async create(
    createCategoryDto: CreateArenaCategoryDto,
    file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<ArenaCategory> {
    const arenaCategory = this.categoryRepository.create(
      createCategoryDto as Partial<ArenaCategory>,
    );
    if (!!file) {
      arenaCategory.image = await this.fileService.uploadFile(file);
    }
    return await this.categoryRepository.save(arenaCategory);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<ArenaCategory>> {
    return await paginate(
      query,
      this.categoryRepository,
      arenaCategoryPaginationConfig,
    );
  }

  async findAllCategories(): Promise<{ label: string; value: string }[]> {
    return await this.categoryRepository
      .createQueryBuilder('category')
      .select('DISTINCT category.name AS label, category.id AS value')
      .getRawMany();
  }

  async findOne(
    field: FindOptionsWhere<ArenaCategory>,
    relations?: FindOptionsRelations<ArenaCategory>,
  ): Promise<NullableType<ArenaCategory>> {
    return await this.categoryRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<ArenaCategory>,
    relations?: FindOptionsRelations<ArenaCategory>,
  ): Promise<ArenaCategory> {
    return await this.categoryRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateAreaCategoryDto: UpdateArenaCategoryDto,
    file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<ArenaCategory> {
    const areaCategory = await this.findOneOrFail({ id });
    Object.assign(areaCategory, updateAreaCategoryDto);
    if (!!file) {
      areaCategory.image = areaCategory.image?.id
        ? await this.fileService.updateFile(areaCategory.image?.id, file)
        : await this.fileService.uploadFile(file);
    }
    return await this.categoryRepository.save(areaCategory);
  }

  async remove(id: string) {
    const category = await this.findOneOrFail({ id });
    if (category.image) {
      await this.fileService.deleteFile(category.image.path);
    }
    return await this.categoryRepository.delete(id);
  }
}
