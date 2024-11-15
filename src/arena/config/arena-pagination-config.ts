import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Arena } from '../entities/arena.entity';

export const arenaPaginationConfig: PaginateConfig<Arena> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['arenas', 'image', 'category', 'userAdmin'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
