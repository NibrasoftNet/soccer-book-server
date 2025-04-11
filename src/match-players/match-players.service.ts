import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Paginate, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { matchPlayersPaginationConfig } from './config/match-players-pagination.config';
import { NullableType } from '../utils/types/nullable.type';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { MatchPlayer } from './entities/match-players.entity';
import { CreateMatchPlayerDto } from '@/domains/match-players/create-match-player.dto';
import { MatchService } from '../match/match.service';
import { UsersService } from '../users/users.service';
import { UpdateMatchPlayerDto } from '@/domains/match-players/update-match-player.dto';

@Injectable()
export class MatchPlayersService {
  constructor(
    @InjectRepository(MatchPlayer)
    private readonly matchPlayerRepository: Repository<MatchPlayer>,
    private readonly matchService: MatchService,
    private readonly userService: UsersService,
    //private readonly notificationService: NotificationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  async create(
    matchId: string,
    createMatchPlayerDto: CreateMatchPlayerDto,
  ): Promise<MatchPlayer> {
    const player = this.matchPlayerRepository.create(
      createMatchPlayerDto as DeepPartial<MatchPlayer>,
    );
    player.user = await this.userService.findOneOrFail({
      id: createMatchPlayerDto.userId,
    });
    player.match = await this.matchService.findOneOrFail({
      id: matchId,
    });
    return this.matchPlayerRepository.save(player);
  }

  async createMany(
    matchId: string,
    createMatchPlayerDtos: CreateMatchPlayerDto[],
  ): Promise<MatchPlayer[]> {
    return await this.matchPlayerRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const match = await this.matchService.findOneOrFail({ id: matchId });
        const players: MatchPlayer[] = [];

        for (const dto of createMatchPlayerDtos) {
          const player = entityManager.create(
            MatchPlayer,
            dto as DeepPartial<MatchPlayer>,
          );
          player.user = await this.userService.findOneOrFail({
            id: dto.userId,
          });
          player.match = match;
          players.push(player);
        }
        return entityManager.save(players);
      },
    );
  }

  async findAll(query: PaginateQuery): Promise<Paginated<MatchPlayer>> {
    return await paginate<MatchPlayer>(
      query,
      this.matchPlayerRepository,
      matchPlayersPaginationConfig,
    );
  }

  async findAllMe(
    userJwtPayload: JwtPayloadType,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<MatchPlayer>> {
    const queryBuilder = this.matchPlayerRepository
      .createQueryBuilder('matchPlayer')
      .leftJoinAndSelect('matchPlayer.user', 'user')
      .where('user.id = :id', { id: userJwtPayload.id });

    return await paginate<MatchPlayer>(
      query,
      queryBuilder,
      matchPlayersPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<MatchPlayer>,
    relations?: FindOptionsRelations<MatchPlayer>,
  ): Promise<NullableType<MatchPlayer>> {
    return await this.matchPlayerRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<MatchPlayer>,
    relations?: FindOptionsRelations<MatchPlayer>,
  ): Promise<MatchPlayer> {
    return await this.matchPlayerRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateMatchPlayerDto: UpdateMatchPlayerDto,
  ): Promise<MatchPlayer> {
    const player = await this.findOneOrFail({ id });
    Object.assign(player, updateMatchPlayerDto);
    return await this.matchPlayerRepository.save(player);
  }

  async remove(id: string) {
    return await this.matchPlayerRepository.delete(id);
  }
}
