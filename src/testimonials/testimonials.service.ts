import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';
import {
  DeepPartial,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UsersService } from '../users/users.service';
import { paginate, Paginate, PaginateQuery } from 'nestjs-paginate';
import { testimonialPaginationConfig } from './config/testimonial-pagination-config';
import { CreateTestimonialDto } from '@/domains/testimonial/create-testimonial.dto';
import { UpdateTestimonialDto } from '@/domains/testimonial/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  constructor(
    @InjectRepository(Testimonial)
    private readonly testimonialRepository: Repository<Testimonial>,
    private readonly usersService: UsersService,
  ) {}
  async create(
    userJwtPayload: JwtPayloadType,
    createTestimonialDto: CreateTestimonialDto,
  ) {
    const testimonial = this.testimonialRepository.create(
      createTestimonialDto as DeepPartial<Testimonial>,
    );
    testimonial.creator = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    return this.testimonialRepository.save(testimonial);
  }

  async findAll(@Paginate() query: PaginateQuery) {
    return await paginate(
      query,
      this.testimonialRepository,
      testimonialPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<Testimonial>,
    relations?: FindOptionsRelations<Testimonial>,
  ) {
    return this.testimonialRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Testimonial>,
    relations?: FindOptionsRelations<Testimonial>,
  ) {
    return this.testimonialRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(id: string, updateTestimonialDto: UpdateTestimonialDto) {
    const testimonial = await this.findOneOrFail({ id });
    Object.assign(testimonial, updateTestimonialDto);
    return this.testimonialRepository.save(testimonial);
  }

  async remove(id: number) {
    return this.testimonialRepository.delete(id);
  }
}
