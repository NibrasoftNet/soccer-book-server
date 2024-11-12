import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Arena } from './entities/arena.entity';
import {
  DeepPartial,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { UsersAdminService } from '../users-admin/users-admin.service';
import { FilesService } from '../files/files.service';
import { CreateArenaDto } from '@/domains/arena/create-arena.dto';
import { AddressService } from '../address/address.service';
import { UpdateArenaDto } from '@/domains/arena/update-arena.dto';
import { Team } from '../team/entities/team.entity';
import { NullableType } from '../utils/types/nullable.type';
import { ArenaCategoryService } from '../arena-category/arena-category.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { arenaPaginationConfig } from './config/arena-pagination-config';

@Injectable()
export class ArenaService {
  constructor(
    @InjectRepository(Arena)
    private readonly arenaRepository: Repository<Arena>,
    private readonly fileService: FilesService,
    private readonly usersAdminService: UsersAdminService,
    private readonly addressService: AddressService,
    private readonly arenaCategoryService: ArenaCategoryService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    createArenaDto: CreateArenaDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<Arena> {
    return await this.arenaRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const arena = entityManager.create(
          Arena,
          createArenaDto as DeepPartial<Arena>,
        );
        arena.userAdmin = await this.usersAdminService.findOneOrFail({
          id: userJwtPayload.id,
        });
        arena.category = await this.arenaCategoryService.findOneOrFail({
          id: createArenaDto.arenaCategoryId,
        });
        arena.address = await this.addressService.create(
          createArenaDto.address,
        );
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
    field: FindOptionsWhere<Team>,
    relations?: FindOptionsRelations<Team>,
  ): Promise<NullableType<Arena>> {
    return await this.arenaRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Team>,
    relations?: FindOptionsRelations<Team>,
  ): Promise<Arena> {
    return await this.arenaRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateArenaDto: UpdateArenaDto,
    files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<Arena> {
    return await this.arenaRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const arena = await this.findOneOrFail({ id });
        const { address, arenaCategoryId, ...filteredArenaDto } =
          updateArenaDto;
        Object.assign(arena, filteredArenaDto);
        if (!!address) {
          arena.address = await this.addressService.update(
            arena.address.id,
            address,
          );
        }
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

  async remove(id: string) {
    return await this.arenaRepository.delete(id);
  }
}
