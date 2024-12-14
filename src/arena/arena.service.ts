import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Arena } from './entities/arena.entity';
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { FilesService } from '../files/files.service';
import { CreateArenaDto } from '@/domains/arena/create-arena.dto';
import { UpdateArenaDto } from '@/domains/arena/update-arena.dto';
import { NullableType } from '../utils/types/nullable.type';
import { ArenaCategoryService } from '../arena-category/arena-category.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { arenaPaginationConfig } from './config/arena-pagination-config';
import { MulterFile } from 'fastify-file-interceptor';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { ComplexService } from '../complex/complex.service';

@Injectable()
export class ArenaService {
  constructor(
    @InjectRepository(Arena)
    private readonly arenaRepository: Repository<Arena>,
    private readonly fileService: FilesService,
    private readonly complexService: ComplexService,
    private readonly arenaCategoryService: ArenaCategoryService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async create(
    complexId: string,
    createArenaDto: CreateArenaDto,
    files?: Array<MulterFile | Express.MulterS3.File>,
  ): Promise<Arena> {
    return await this.arenaRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const arena = entityManager.create(
          Arena,
          createArenaDto as DeepPartial<Arena>,
        );
        arena.complex = await this.complexService.findOneOrFail({
          id: complexId,
        });
        arena.category = await this.arenaCategoryService.findOneOrFail({
          id: createArenaDto.arenaCategoryId,
        });
        if (!!files) {
          arena.image = await this.fileService.uploadMultipleFiles(files);
        }
        // Save the team using the transaction manager
        return await entityManager.save(arena);
      },
    );
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Arena>> {
    return await paginate<Arena>(
      query,
      this.arenaRepository,
      arenaPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<Arena>,
    relations?: FindOptionsRelations<Arena>,
  ): Promise<NullableType<Arena>> {
    return await this.arenaRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Arena>,
    relations?: FindOptionsRelations<Arena>,
  ): Promise<Arena> {
    return await this.arenaRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateArenaDto: UpdateArenaDto,
    files?: Array<MulterFile | Express.MulterS3.File>,
  ): Promise<Arena> {
    return await this.arenaRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const arena = await this.findOneOrFail({ id });
        const { arenaCategoryId, ...filteredArenaDto } = updateArenaDto;
        Object.assign(arena, filteredArenaDto);
        if (!!arenaCategoryId) {
          arena.category = await this.arenaCategoryService.findOneOrFail({
            id: arenaCategoryId,
          });
        }
        if (!!files) {
          // TODO HANDLE UPDATE MULTIPLE FILES
          arena.image = await this.fileService.uploadMultipleFiles(files);
        }
        // Save the team using the transaction manager
        return await entityManager.save(arena);
      },
    );
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.arenaRepository.delete(id);
  }
}
