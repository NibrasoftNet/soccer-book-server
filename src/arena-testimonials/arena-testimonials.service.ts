import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UsersService } from '../users/users.service';
import { ArenaTestimonial } from './entities/arena-testimonial.entity';
import { ArenaService } from '../arena/arena.service';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { CreateArenaTestimonialDto } from '@/domains/arena-testimonials/create-arena-testimonial.dto';
import { paginate, Paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { arenaTestimonialPaginationConfig } from './config/arena-testimonial-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateArenaTestimonialDto } from '@/domains/arena-testimonials/update-arena-testimonial.dto';

@Injectable()
export class ArenaTestimonialsService {
  constructor(
    @InjectRepository(ArenaTestimonial)
    private readonly arenaTestimonialRepository: Repository<ArenaTestimonial>,
    private readonly usersService: UsersService,
    private readonly arenaService: ArenaService,
  ) {}
  async create(
    userJwtPayload: JwtPayloadType,
    arenaId: string,
    createArenaTestimonialDto: CreateArenaTestimonialDto,
  ): Promise<ArenaTestimonial> {
    const testimonial = this.arenaTestimonialRepository.create(
      createArenaTestimonialDto as DeepPartial<ArenaTestimonial>,
    );
    testimonial.creator = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    testimonial.arena = await this.arenaService.findOneOrFail({ id: arenaId });
    return this.arenaTestimonialRepository.save(testimonial);
  }

  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<ArenaTestimonial>> {
    return await paginate(
      query,
      this.arenaTestimonialRepository,
      arenaTestimonialPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<ArenaTestimonial>,
    relations?: FindOptionsRelations<ArenaTestimonial>,
  ): Promise<NullableType<ArenaTestimonial>> {
    return await this.arenaTestimonialRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<ArenaTestimonial>,
    relations?: FindOptionsRelations<ArenaTestimonial>,
  ): Promise<ArenaTestimonial> {
    return await this.arenaTestimonialRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateArenaTestimonialDto: UpdateArenaTestimonialDto,
  ): Promise<ArenaTestimonial> {
    const testimonial = await this.findOneOrFail({ id });
    Object.assign(testimonial, updateArenaTestimonialDto);
    return await this.arenaTestimonialRepository.save(testimonial);
  }

  async remove(id: string): Promise<DeleteResult> {
    return await this.arenaTestimonialRepository.delete(id);
  }
}
