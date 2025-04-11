import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { MatchPlayer } from '../entities/match-players.entity';

export const matchPlayersPaginationConfig: PaginateConfig<MatchPlayer> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['user', 'match'],
  searchableColumns: ['accepted'],
  sortableColumns: ['createdAt', 'updatedAt', 'accepted'],
  defaultLimit: 100,
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    accepted: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
