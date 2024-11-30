import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TournamentParticipation } from './entities/tournament-participation.entity';
import {
  DeleteResult,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { TeamService } from '../team/team.service';
import { TournamentService } from '../tournament/tournament.service';
import { NullableType } from '../utils/types/nullable.type';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { ParticipationStatusEnum } from '@/enums/tournament-participation/participation-status.enum';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { tournamentParticipationPaginateConfig } from './config/tournament-participation-pagination-config';
import dayjs from 'dayjs';

@Injectable()
export class TournamentParticipationService {
  constructor(
    @InjectRepository(TournamentParticipation)
    private readonly tournamentParticipationRepository: Repository<TournamentParticipation>,
    private readonly teamService: TeamService,
    private readonly tournamentService: TournamentService,
    private readonly i18n: I18nService,
  ) {}

  async create(
    tournamentId: string,
    teamId: string,
  ): Promise<TournamentParticipation> {
    const alreadyParticipating = await this.findOne(
      {
        tournament: {
          id: tournamentId,
        },
        team: {
          id: teamId,
        },
      },
      { team: true, tournament: true },
    );

    if (alreadyParticipating) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            tournament: this.i18n.t('tournament.alreadyApplied', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const tournament = await this.tournamentService.findOneOrFail({
      id: tournamentId,
    });
    if (dayjs(tournament.lastSubscriptionDate).isBefore(new Date())) {
      throw new HttpException(
        {
          status: HttpStatus.PRECONDITION_FAILED,
          errors: {
            tournament: this.i18n.t('tournament.expired', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.PRECONDITION_FAILED,
      );
    }
    const participation = this.tournamentParticipationRepository.create();
    participation.tournament = tournament;
    participation.team = await this.teamService.findOneOrFail({
      id: teamId,
    });
    return this.tournamentParticipationRepository.save(participation);
  }

  async findAll(
    query: PaginateQuery,
  ): Promise<Paginated<TournamentParticipation>> {
    return await paginate<TournamentParticipation>(
      query,
      this.tournamentParticipationRepository,
      tournamentParticipationPaginateConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<TournamentParticipation>,
    relations?: FindOptionsRelations<TournamentParticipation>,
  ): Promise<NullableType<TournamentParticipation>> {
    return await this.tournamentParticipationRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<TournamentParticipation>,
    relations?: FindOptionsRelations<TournamentParticipation>,
  ): Promise<TournamentParticipation> {
    return await this.tournamentParticipationRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async handleParticipationStatus(
    id: string,
    status: ParticipationStatusEnum,
  ): Promise<any> {
    const handler = this.getHandler(status);
    if (!handler) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          errors: {
            handler: `Handler not found for status: ${status}`,
          },
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return handler(id);
  }

  private getHandler(
    status: ParticipationStatusEnum,
  ): (id: string) => Promise<TournamentParticipation> | null {
    const handlers: Record<
      ParticipationStatusEnum,
      (id: string) => Promise<TournamentParticipation> | null
    > = {
      [ParticipationStatusEnum.ACCEPTED]: (id) => this.acceptParticipation(id),
      [ParticipationStatusEnum.REJECTED]: (id) => this.rejectParticipation(id),
      [ParticipationStatusEnum.CANCELLED]: (id) => this.cancelParticipation(id),
      [ParticipationStatusEnum.PENDING]: () => null,
    };

    return handlers[status] || null;
  }

  private async acceptParticipation(
    id: string,
  ): Promise<TournamentParticipation> {
    return await this.tournamentParticipationRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Find the participation and load related entities
        const participation = await entityManager.findOneOrFail(
          TournamentParticipation,
          { where: { id: id }, relations: ['team', 'tournament'] },
        );

        // Update the participation status
        participation.status = ParticipationStatusEnum.ACCEPTED;
        await entityManager.save(participation);

        // Increment the totalJoinedTeams of the related Tournament
        const tournament = participation.tournament;
        tournament.totalJoinedTeams += 1;
        await entityManager.save(tournament);

        return participation;
      },
    );
  }

  private async rejectParticipation(
    id: string,
  ): Promise<TournamentParticipation> {
    return await this.tournamentParticipationRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Find the participation and load related entities
        const participation = await entityManager.findOneOrFail(
          TournamentParticipation,
          { where: { id: id }, relations: ['team', 'tournament'] },
        );

        // Update the participation status
        participation.status = ParticipationStatusEnum.REJECTED;
        await entityManager.save(participation);

        // Increment the totalJoinedTeams of the related Tournament
        const tournament = participation.tournament;
        tournament.totalJoinedTeams -= 1;
        await entityManager.save(tournament);

        return participation;
      },
    );
  }

  private async cancelParticipation(
    id: string,
  ): Promise<TournamentParticipation> {
    const participation = await this.findOneOrFail({ id });
    participation.status = ParticipationStatusEnum.CANCELLED;
    return await this.tournamentParticipationRepository.save(participation);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.tournamentParticipationRepository.delete(id);
  }
}
