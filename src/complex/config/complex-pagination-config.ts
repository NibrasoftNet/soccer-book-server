import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Complex } from '../entities/complex.entity';

export const complexPaginationConfig: PaginateConfig<Complex> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['creator', 'arenas', 'image'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    name: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
