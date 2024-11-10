import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { SubscriptionToTeam } from '../entities/subscription-to-team.entity';

export const subscriptionToTeamPaginationConfig: PaginateConfig<SubscriptionToTeam> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['team', 'member', 'team.creator'],
    searchableColumns: ['status'],
    sortableColumns: ['createdAt', 'updatedAt', 'status'],
    defaultLimit: 50,
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      status: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
