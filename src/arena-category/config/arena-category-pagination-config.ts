import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { ArenaCategory } from '../entities/arena-category.entity';

export const arenaCategoryPaginationConfig: PaginateConfig<ArenaCategory> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['arenas', 'image'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
