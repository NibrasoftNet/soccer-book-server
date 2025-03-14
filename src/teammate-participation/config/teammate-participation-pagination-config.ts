import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { TeammateParticipation } from '../entities/teammate-participation.entity';

export const teammateParticipationPaginationConfig: PaginateConfig<TeammateParticipation> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['user', 'user.photo'],
    searchableColumns: ['status'],
    sortableColumns: ['createdAt', 'updatedAt'],
    defaultLimit: 20,
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      createdAt: [FilterOperator.EQ, FilterSuffix.NOT],
      status: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
