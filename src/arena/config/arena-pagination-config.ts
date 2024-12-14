import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Arena } from '../entities/arena.entity';

export const arenaPaginationConfig: PaginateConfig<Arena> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['image', 'category', 'userAdmin', 'reservations'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterSuffix.NOT],
    'reservations.day': [FilterOperator.EQ, FilterSuffix.NOT],
    'reservations.status': [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
