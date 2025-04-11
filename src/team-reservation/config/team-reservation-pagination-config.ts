import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { TeamReservation } from '../entities/team-reservation.entity';

export const teamReservationPaginationConfig: PaginateConfig<TeamReservation> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['home', 'away', 'arena'],
    searchableColumns: ['status'],
    sortableColumns: ['createdAt', 'updatedAt', 'status', 'day'],
    defaultLimit: 100,
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      status: [FilterOperator.EQ, FilterSuffix.NOT],
      day: [
        FilterOperator.EQ,
        FilterSuffix.NOT,
        FilterOperator.GTE,
        FilterOperator.BTW,
      ],
      'arena.id': [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
