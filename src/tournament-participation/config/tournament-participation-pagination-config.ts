import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { TournamentParticipation } from '../entities/tournament-participation.entity';

export const tournamentParticipationPaginateConfig: PaginateConfig<TournamentParticipation> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['team', 'tournament', 'tournament.complex'],
    searchableColumns: ['tournament.complex.name'],
    sortableColumns: ['createdAt', 'updatedAt'],
    defaultLimit: 20,
    maxLimit: 20,
    loadEagerRelations: true,
    filterableColumns: {
      status: [FilterOperator.EQ, FilterSuffix.NOT],
      'tournament.arena.name': [
        FilterOperator.EQ,
        FilterSuffix.NOT,
        FilterOperator.ILIKE,
      ],
    },
  };
