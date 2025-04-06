import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { Teammate } from './entities/teammate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateTeammateDto } from '@/domains/teammate/create-teammate.dto';
import { UpdateTeammateDto } from '@/domains/teammate/update-teammate.dto';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { teammatePaginationConfig } from './config/teammate-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { ReservationService } from '../reservation/reservation.service';
import { ProximityQueryDto } from '@/domains/complex/proximity-query.dto';
import { WinstonLoggerService } from '../logger/winston-logger.service';

@Injectable()
export class TeammateService {
  constructor(
    @InjectRepository(Teammate)
    private readonly teammateRepository: Repository<Teammate>,
    private readonly usersService: UsersService,
    private readonly reservationService: ReservationService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async create(
    userJwtPayload: JwtPayloadType,
    reservationId: string,
    createTeammateDto: CreateTeammateDto,
  ): Promise<Teammate> {
    const teammate = this.teammateRepository.create(
      createTeammateDto as DeepPartial<Teammate>,
    );
    teammate.reservation = await this.reservationService.findOneOrFail({
      id: reservationId,
    });
    teammate.creator = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    return await this.teammateRepository.save(teammate);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Teammate>> {
    return await paginate<Teammate>(
      query,
      this.teammateRepository,
      teammatePaginationConfig,
    );
  }

  async findAllWithDistance(
    proximityQueryDto: ProximityQueryDto,
  ): Promise<Teammate[]> {
    const stopWatching = this.logger.watch('teammates-findAllWithDistance', {
      description: `find All teammates With Distance`,
      class: TeammateService.name,
      function: 'findAllWithDistance',
    });
    const teammates = await this.teammateRepository
      .createQueryBuilder('teammate')
      .leftJoinAndSelect('teammate.creator', 'creator')
      .leftJoinAndSelect('creator.photo', 'photo')
      .leftJoinAndSelect('teammate.reservation', 'reservation')
      .leftJoinAndSelect('reservation.arena', 'arena')
      .leftJoinAndSelect('arena.complex', 'complex')
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
    return teammates;
  }

  async findAllMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.teammateRepository
      .createQueryBuilder('teammate')
      .leftJoinAndSelect('teammate.creator', 'creator')
      .where('creator.id = :id', { id: userJwtPayload.id });

    return await paginate<Teammate>(
      query,
      queryBuilder,
      teammatePaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<Teammate>,
    relations?: FindOptionsRelations<Teammate>,
  ): Promise<NullableType<Teammate>> {
    return await this.teammateRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Teammate>,
    relations?: FindOptionsRelations<Teammate>,
  ): Promise<Teammate> {
    return await this.teammateRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateTeammateDto: UpdateTeammateDto,
  ): Promise<Teammate> {
    const teammate = await this.findOneOrFail({ id });
    Object.assign(teammate, updateTeammateDto);
    if (updateTeammateDto.reservationId) {
      teammate.reservation = await this.reservationService.findOneOrFail({
        id: updateTeammateDto.reservationId,
      });
    }
    return await this.teammateRepository.save(teammate);
  }

  async remove(id: string) {
    return await this.teammateRepository.delete(id);
  }
}
