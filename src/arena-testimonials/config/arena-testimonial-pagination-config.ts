import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { ArenaTestimonial } from '../entities/arena-testimonial.entity';

export const arenaTestimonialPaginationConfig: PaginateConfig<ArenaTestimonial> =
  {
    defaultSortBy: [['createdAt', 'DESC']],
    relations: ['user', 'user.photo', 'arena'],
    searchableColumns: ['rate'],
    sortableColumns: ['createdAt', 'updatedAt'],
    defaultLimit: 20,
    maxLimit: 100,
    loadEagerRelations: true,
    filterableColumns: {
      createdAt: [FilterOperator.EQ, FilterSuffix.NOT],
      'arena.id': [FilterOperator.EQ, FilterSuffix.NOT],
    },
  };
