import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { User } from '../entities/user.entity';

export const usersPaginationConfig: PaginateConfig<User> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['address', 'role', 'status', 'photo'],
  searchableColumns: [
    'email',
    'role.name',
    'status.name',
    'address.country',
    'address.city',
  ],
  sortableColumns: [
    'email',
    'address.city',
    'createdAt',
    'updatedAt',
    'status',
  ],
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    email: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
    userName: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
    phone: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
    createdAt: [
      FilterOperator.EQ,
      FilterSuffix.NOT,
      FilterOperator.GTE,
      FilterOperator.LTE,
      FilterOperator.BTW,
    ],
    'address.city': [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
    'status.name': [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.ILIKE],
  },
};
