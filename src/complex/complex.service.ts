import { Injectable } from '@nestjs/common';
import { CreateComplexDto } from '@/domains/complex/create-complex.dto';
import { UpdateComplexDto } from '@/domains/complex/update-complex.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { FilesService } from '../files/files.service';
import { UsersAdminService } from '../users-admin/users-admin.service';
import { AddressService } from '../address/address.service';
import { WinstonLoggerService } from '../logger/winston-logger.service';
import { Complex } from './entities/complex.entity';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { MulterFile } from 'fastify-file-interceptor';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { complexPaginationConfig } from './config/complex-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { ProximityQueryDto } from '@/domains/complex/proximity-query.dto';

@Injectable()
export class ComplexService {
  constructor(
    @InjectRepository(Complex)
    private readonly complexRepository: Repository<Complex>,
    private readonly fileService: FilesService,
    private readonly usersAdminService: UsersAdminService,
    private readonly addressService: AddressService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    createComplexDto: CreateComplexDto,
    file?: MulterFile | Express.MulterS3.File,
  ): Promise<Complex> {
    return await this.complexRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const complex = entityManager.create(
          Complex,
          createComplexDto as DeepPartial<Complex>,
        );
        complex.creator = await this.usersAdminService.findOneOrFail({
          id: userJwtPayload.id,
        });
        complex.address = await this.addressService.create(
          createComplexDto.address,
        );
        if (!!file) {
          complex.image = await this.fileService.uploadFile(file);
        }
        // Save the team using the transaction manager
        return await entityManager.save(complex);
      },
    );
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Complex>> {
    return await paginate<Complex>(
      query,
      this.complexRepository,
      complexPaginationConfig,
    );
  }

  async findAllWithDistance(
    proximityQueryDto: ProximityQueryDto,
  ): Promise<Complex[]> {
    const stopWatching = this.logger.watch('complex-findAllWithDistance', {
      description: `find All complexes With Distance`,
      class: ComplexService.name,
      function: 'findAllWithDistance',
    });
    const complexes = await this.complexRepository
      .createQueryBuilder('complex')
      .leftJoinAndSelect('complex.image', 'image')
      .leftJoinAndSelect('complex.arenas', 'arenas')
      .leftJoinAndSelect('complex.address', 'address')
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
    return complexes;
  }

  async findOne(
    field: FindOptionsWhere<Complex>,
    relations?: FindOptionsRelations<Complex>,
  ): Promise<NullableType<Complex>> {
    return await this.complexRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Complex>,
    relations?: FindOptionsRelations<Complex>,
  ): Promise<Complex> {
    return await this.complexRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateComplexDto: UpdateComplexDto,
    file?: MulterFile | Express.MulterS3.File,
  ): Promise<Complex> {
    const { address, ...filteredUpdateComplexDto } = updateComplexDto;
    const complex = await this.findOneOrFail({ id });
    Object.assign(complex, filteredUpdateComplexDto);
    if (address) {
      complex.address = await this.addressService.update(
        complex.address.id,
        address,
      );
    }
    if (file) {
      complex.image = complex.image?.id
        ? await this.fileService.updateFile(complex.image.id, file)
        : await this.fileService.uploadFile(file);
    }
    return await this.complexRepository.save(complex);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.complexRepository.delete(id);
  }
}
