import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Match } from '../entities/match.entity';

export const matchPaginationConfig: PaginateConfig<Match> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['home', 'away', 'arena'],
  searchableColumns: ['winner'],
  sortableColumns: ['createdAt', 'updatedAt', 'winner'],
  defaultLimit: 100,
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    winner: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
