import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsRelations,
  FindOptionsWhere,
  Not,
  Repository,
} from 'typeorm';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { UsersService } from '../users/users.service';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { subscriptionToTeamPaginationConfig } from './config/subscription-to-team-pagination-config';
import { SubscriptionToTeam } from './entities/subscription-to-team.entity';
import { Team } from '../team/entities/team.entity';
import { SubscriptionToTeamStatusEnum } from '@/enums/subscription-to-team/subscription-to-team-status.enum';
import { UpdateSubscriptionToTeamDto } from '@/domains/subscription-to-team/update-subscription-to-team.dto';

@Injectable()
export class SubscriptionToTeamService {
  constructor(
    @InjectRepository(SubscriptionToTeam)
    private readonly subscriptionToTeamRepository: Repository<SubscriptionToTeam>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    private readonly usersService: UsersService,
    private readonly i18n: I18nService,
  ) {}

  async addMember(teamId: string, userId: string): Promise<SubscriptionToTeam> {
    const existSubscriptionToTeam = await this.findOne({
      team: { id: teamId },
      member: { id: userId },
    });
    if (existSubscriptionToTeam) {
      throw new UnprocessableEntityException(
        `{"team": "${this.i18n.t('team.alreadySubscribed', { lang: I18nContext.current()?.lang })}"}`,
      );
    }
    const subscriptionToTeam = this.subscriptionToTeamRepository.create();
    subscriptionToTeam.member = await this.usersService.findOneOrFail({
      id: userId,
    });
    subscriptionToTeam.team = await this.teamRepository.findOneOrFail({
      where: {
        id: teamId,
        active: true,
        creator: { id: Not(userId) },
      },
    });
    return await this.subscriptionToTeamRepository.save(subscriptionToTeam);
  }

  async findAll(query: PaginateQuery) {
    return await paginate(
      query,
      this.subscriptionToTeamRepository,
      subscriptionToTeamPaginationConfig,
    );
  }

  async findAllMe(userJwtPayload: JwtPayloadType, query: PaginateQuery) {
    const queryBuilder = this.subscriptionToTeamRepository
      .createQueryBuilder('subscriptionToTeam')
      .leftJoinAndSelect('subscriptionToTeam.member', 'member')
      .where('member.id = :id', { id: userJwtPayload.id });

    return await paginate(
      query,
      queryBuilder,
      subscriptionToTeamPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<SubscriptionToTeam>,
    relations?: FindOptionsRelations<SubscriptionToTeam>,
  ) {
    return await this.subscriptionToTeamRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<SubscriptionToTeam>,
    relations?: FindOptionsRelations<SubscriptionToTeam>,
  ) {
    return await this.subscriptionToTeamRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateSubscriptionToTeamDto: UpdateSubscriptionToTeamDto,
  ): Promise<SubscriptionToTeam> {
    const subscription = await this.findOneOrFail({ id });
    Object.assign(subscription, updateSubscriptionToTeamDto);
    return await this.subscriptionToTeamRepository.save(subscription);
  }

  async cancelSubscription(id: string, userId: string) {
    const member = await this.findOneOrFail({
      id,
      member: { id: userId },
    });
    member.status = SubscriptionToTeamStatusEnum.CANCELLED;
    return await this.subscriptionToTeamRepository.save(member);
  }

  async remove(id: string) {
    return await this.subscriptionToTeamRepository.delete(id);
  }
}
