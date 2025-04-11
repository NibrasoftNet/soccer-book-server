import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Paginate, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { matchPaginationConfig } from './config/match-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { Match } from './entities/match.entity';
import { ReservationService } from '../reservation/reservation.service';
import { TeamReservationService } from '../team-reservation/team-reservation.service';
import { CreateMatchDto } from '@/domains/match/create-match.dto';
import { UpdateMatchDto } from '@/domains/match/update-match.dto';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private readonly reservationService: ReservationService,
    private readonly teamReservationService: TeamReservationService,
    //private readonly notificationService: NotificationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const { reservationId, teamReservationId, ...filteredCreateMatchDto } =
      createMatchDto;
    const match = this.matchRepository.create(
      filteredCreateMatchDto as DeepPartial<Match>,
    );
    if (reservationId) {
      match.reservation = await this.reservationService.findOneOrFail({
        id: reservationId,
      });
    }
    if (teamReservationId) {
      match.teamReservation = await this.teamReservationService.findOneOrFail({
        id: teamReservationId,
      });
    }
    return this.matchRepository.save(match);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Match>> {
    return await paginate<Match>(
      query,
      this.matchRepository,
      matchPaginationConfig,
    );
  }

  async findAllMe(
    userJwtPayload: JwtPayloadType,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Match>> {
    const queryBuilder = this.matchRepository
      .createQueryBuilder('teamReservation')
      .leftJoinAndSelect('teamReservation.home', 'home')
      .leftJoinAndSelect('home.creator', 'creator')
      .leftJoinAndSelect('teamReservation.arena', 'arena')
      .where('creator.id = :id', { id: userJwtPayload.id });

    return await paginate<Match>(query, queryBuilder, matchPaginationConfig);
  }

  async findOne(
    field: FindOptionsWhere<Match>,
    relations?: FindOptionsRelations<Match>,
  ): Promise<NullableType<Match>> {
    return await this.matchRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Match>,
    relations?: FindOptionsRelations<Match>,
  ): Promise<Match> {
    return await this.matchRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(id: string, updateMatchDto: UpdateMatchDto): Promise<Match> {
    const match = await this.findOneOrFail({ id });
    Object.assign(match, updateMatchDto);
    return await this.matchRepository.save(match);
  }

  async remove(id: string) {
    return await this.matchRepository.delete(id);
  }
}
