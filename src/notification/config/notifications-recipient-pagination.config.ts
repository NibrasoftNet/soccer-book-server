import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';

import { NotificationRecipient } from '../entities/notification-recipient.entity';

export const notificationsRecipientPaginationConfig: PaginateConfig<NotificationRecipient> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['user', 'notification'],
    searchableColumns: ['user.id'],
    sortableColumns: ['createdAt', 'updatedAt', 'isRead'],
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      isRead: [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
