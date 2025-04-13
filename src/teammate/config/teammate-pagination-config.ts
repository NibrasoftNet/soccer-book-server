import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Teammate } from '../entities/teammate.entity';

export const teammatePaginationConfig: PaginateConfig<Teammate> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: [
    'creator',
    'creator.photo',
    'reservation',
    'reservation.arena.complex',
    'reservation.arena.complex.address',
    'participations',
    'participations.creator',
  ],
  searchableColumns: ['preferences'],
  sortableColumns: ['createdAt', 'updatedAt', 'preferences'],
  defaultLimit: 20,
  maxLimit: 20,
  loadEagerRelations: true,
  filterableColumns: {
    isFilled: [FilterOperator.EQ, FilterSuffix.NOT],
    requiredPlayers: [FilterOperator.EQ, FilterSuffix.NOT],
    'creator.id': [FilterOperator.EQ, FilterSuffix.NOT],
    'reservation.arena.complex.id': [FilterOperator.EQ, FilterSuffix.NOT],
    'reservation.arena.complex.address.city': [
      FilterOperator.EQ,
      FilterSuffix.NOT,
    ],
  },
};
