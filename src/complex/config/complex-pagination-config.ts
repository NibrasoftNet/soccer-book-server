import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Complex } from '../entities/complex.entity';

export const complexPaginationConfig: PaginateConfig<Complex> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['creator', 'arenas', 'image', 'arenas.image', 'address'],
  searchableColumns: ['name'],
  sortableColumns: ['createdAt', 'updatedAt', 'name'],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    'creator.id': [FilterOperator.EQ, FilterSuffix.NOT],
    name: [
      FilterOperator.EQ,
      FilterSuffix.NOT,
      FilterOperator.ILIKE,
      FilterOperator.CONTAINS,
    ],
    'arenas.category.id': [FilterOperator.EQ, FilterSuffix.NOT],
    'arenas.unitPrice': [
      FilterOperator.EQ,
      FilterOperator.BTW,
      FilterOperator.LTE,
    ],
    'arenas.length': [
      FilterOperator.EQ,
      FilterOperator.BTW,
      FilterOperator.LTE,
    ],
  },
};
