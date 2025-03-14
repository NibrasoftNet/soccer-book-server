import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { TeammateParticipation } from './entities/teammate-participation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { I18nService } from 'nestjs-i18n';
import { TeammateService } from '../teammate/teammate.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { teammateParticipationPaginationConfig } from './config/teammate-participation-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateTeammateParticipationDto } from '@/domains/teammate-paticipation/update-teammate-participation.dto';
import { TeammateParticipationStatusEnum } from '@/enums/teammate-paticipation/teammate-participation.enum';

@Injectable()
export class TeammateParticipationService {
  constructor(
    @InjectRepository(TeammateParticipation)
    private readonly teammateParticipationRepository: Repository<TeammateParticipation>,
    private readonly teammateService: TeammateService,
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}
  async create(
    userJwtPayload: JwtPayloadType,
    teammateId: string,
  ): Promise<TeammateParticipation> {
    const teammateParticipation = this.teammateParticipationRepository.create();
    teammateParticipation.creator = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    teammateParticipation.teammate = await this.teammateService.findOneOrFail({
      id: teammateId,
      active: true,
    });
    return await this.teammateParticipationRepository.save(
      teammateParticipation,
    );
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.teammateParticipationRepository,
      teammateParticipationPaginationConfig,
    );
  }

  async findAllMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.teammateParticipationRepository
      .createQueryBuilder('teammateParticipation')
      .leftJoinAndSelect('teammateParticipation.creator', 'creator')
      .where('creator.id = :id', { id: userJwtPayload.id });

    return await paginate(
      query,
      queryBuilder,
      teammateParticipationPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<TeammateParticipation>,
    relations?: FindOptionsRelations<TeammateParticipation>,
  ): Promise<NullableType<TeammateParticipation>> {
    return await this.teammateParticipationRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<TeammateParticipation>,
    relations?: FindOptionsRelations<TeammateParticipation>,
  ): Promise<TeammateParticipation> {
    return await this.teammateParticipationRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateTeammateParticipationDto: UpdateTeammateParticipationDto,
  ): Promise<TeammateParticipation> {
    const teammateParticipation = await this.findOneOrFail(
      {
        id,
      },
      { teammate: true },
    );
    const isFilled =
      teammateParticipation.teammate.requiredPlayers <=
      teammateParticipation.teammate.totalAccepted + 1;
    await this.teammateService.update(teammateParticipation.teammate.id, {
      isFilled,
      active: !isFilled,
      totalAccepted:
        updateTeammateParticipationDto.status ===
        TeammateParticipationStatusEnum.ACCEPTED
          ? teammateParticipation.teammate.totalAccepted + 1
          : teammateParticipation.teammate.totalAccepted,
    });
    Object.assign(teammateParticipation, updateTeammateParticipationDto);
    return await this.teammateParticipationRepository.save(
      teammateParticipation,
    );
  }

  async remove(id: string) {
    return await this.teammateParticipationRepository.delete(id);
  }
}
