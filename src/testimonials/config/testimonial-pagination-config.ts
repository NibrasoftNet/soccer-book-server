import { FilterOperator, FilterSuffix, PaginateConfig } from 'nestjs-paginate';
import { Testimonial } from '../entities/testimonial.entity';

export const testimonialPaginationConfig: PaginateConfig<Testimonial> = {
  defaultSortBy: [['createdAt', 'DESC']],
  relations: ['user', 'user.photo'],
  searchableColumns: ['rate'],
  sortableColumns: ['createdAt', 'updatedAt'],
  defaultLimit: 20,
  maxLimit: 100,
  loadEagerRelations: true,
  filterableColumns: {
    createdAt: [FilterOperator.EQ, FilterSuffix.NOT],
  },
};
