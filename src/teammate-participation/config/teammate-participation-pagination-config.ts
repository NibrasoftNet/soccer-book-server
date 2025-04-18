import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { TeammateParticipation } from '../entities/teammate-participation.entity';

export const teammateParticipationPaginationConfig: PaginateConfig<TeammateParticipation> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['creator', 'creator.photo', 'teammate'],
    searchableColumns: ['status'],
    sortableColumns: ['createdAt', 'updatedAt'],
    defaultLimit: 20,
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      createdAt: [FilterOperator.EQ, FilterSuffix.NOT],
      status: [FilterOperator.EQ, FilterSuffix.NOT],
      'teammate.id': [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
