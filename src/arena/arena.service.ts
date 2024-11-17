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
import { NullableType } from '../utils/types/nullable.type';
import { ArenaCategoryService } from '../arena-category/arena-category.service';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { arenaPaginationConfig } from './config/arena-pagination-config';
import { MulterFile } from 'fastify-file-interceptor';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { ProximityQueryDto } from '@/domains/arena/proximity-query.dto';

@Injectable()
export class ArenaService {
  constructor(
    @InjectRepository(Arena)
    private readonly arenaRepository: Repository<Arena>,
    private readonly fileService: FilesService,
    private readonly usersAdminService: UsersAdminService,
    private readonly addressService: AddressService,
    private readonly arenaCategoryService: ArenaCategoryService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    createArenaDto: CreateArenaDto,
    files?: Array<MulterFile | Express.MulterS3.File>,
  ): Promise<Arena> {
    return await this.arenaRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const arena = entityManager.create(
          Arena,
          createArenaDto as DeepPartial<Arena>,
        );
        arena.creator = await this.usersAdminService.findOneOrFail({
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

  async findAllWithDistance(
    proximityQueryDto: ProximityQueryDto,
  ): Promise<Arena[]> {
    const stopWatching = this.logger.watch('arena-findAllWithDistance', {
      description: `find All arenas With Distance`,
      class: ArenaService.name,
      function: 'findAllWithDistance',
    });
    const arenas = await this.arenaRepository
      .createQueryBuilder('arena')
      .leftJoinAndSelect('arena.address', 'address')
      .where(
        'ST_DWithin(ST_SetSRID(ST_MakePoint( :userLatitude, :userLongitude),4326)::geography, ST_SetSRID(ST_MakePoint(address.latitude, address.longitude),4326)::geography, :distance)',
      )
      .setParameters({
        userLongitude: proximityQueryDto.longitude,
        userLatitude: proximityQueryDto.latitude,
        distance: proximityQueryDto.distance,
      })
      .getMany();

    stopWatching();
    return arenas;
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
