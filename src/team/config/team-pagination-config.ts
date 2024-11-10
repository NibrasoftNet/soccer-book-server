import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Team } from '../entities/team.entity';

export const teamPaginationConfig: PaginateConfig<Team> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['creator', 'creator.photo', 'members'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  defaultLimit: 20,
  maxLimit: 20,
  loadEagerRelations: true,
  filterableColumns: {
    active: [FilterOperator.EQ, FilterSuffix.NOT],
    name: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
