import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Reservation } from '../entities/reservation.entity';

export const reservationPaginationConfig: PaginateConfig<Reservation> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['arena', 'user'],
  searchableColumns: ['status'],
  sortableColumns: ['createdAt', 'updatedAt', 'status', 'day'],
  defaultLimit: 100,
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    status: [FilterOperator.EQ, FilterSuffix.NOT],
    day: [FilterOperator.EQ, FilterSuffix.NOT, FilterOperator.GTE],
    'arena.id': [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
