import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Tournament } from '../entities/tournament.entity';

export const tournamentPaginationConfig: PaginateConfig<Tournament> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['image', 'arena', 'participations'],
  searchableColumns: ['arena.name'],
  sortableColumns: ['createdAt', 'updatedAt'],
  defaultLimit: 20,
  maxLimit: 20,
  loadEagerRelations: true,
  filterableColumns: {
    active: [FilterOperator.EQ, FilterSuffix.NOT],
    startDate: [FilterOperator.EQ, FilterSuffix.NOT],
    finishDate: [FilterOperator.EQ, FilterSuffix.NOT],
    lastSubscriptionDate: [FilterOperator.EQ, FilterSuffix.NOT],
    'arena.name': [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
  },
};
