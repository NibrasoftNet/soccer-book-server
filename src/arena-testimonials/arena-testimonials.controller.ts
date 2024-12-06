import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Request,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { IsCreatorPipe } from '../utils/pipes/is-creator.pipe';
import { ArenaTestimonialsService } from './arena-testimonials.service';
import { ArenaTestimonial } from './entities/arena-testimonial.entity';
import { ArenaTestimonialDto } from '@/domains/arena-testimonials/arena-testimonial.dto';
import { CreateArenaTestimonialDto } from '@/domains/arena-testimonials/create-arena-testimonial.dto';
import { arenaTestimonialPaginationConfig } from './config/arena-testimonial-pagination-config';
import { UpdateArenaTestimonialDto } from '@/domains/arena-testimonials/update-arena-testimonial.dto';

@ApiTags('Arena-Testimonials')
@ApiBearerAuth()
@Controller({ version: '1', path: 'arena-testimonials' })
export class ArenaTestimonialsController {
  constructor(
    private readonly arenaTestimonialsService: ArenaTestimonialsService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(ArenaTestimonial, ArenaTestimonialDto))
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.ADMIN, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post('arenas/:id')
  async create(
    @Request() request,
    @Param('id') arenaId: string,
    @Body() createArenaTestimonialDto: CreateArenaTestimonialDto,
  ): Promise<ArenaTestimonial> {
    return await this.arenaTestimonialsService.create(
      request.user,
      arenaId,
      createArenaTestimonialDto,
    );
  }

  @ApiPaginationQuery(arenaTestimonialPaginationConfig)
  @UseInterceptors(
    MapInterceptor(ArenaTestimonial, ArenaTestimonialDto, { isArray: true }),
  )
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<ArenaTestimonial, ArenaTestimonialDto>> {
    const testimonials = await this.arenaTestimonialsService.findAll(query);
    return new PaginatedDto<ArenaTestimonial, ArenaTestimonialDto>(
      this.mapper,
      testimonials,
      ArenaTestimonial,
      ArenaTestimonialDto,
    );
  }

  @UseInterceptors(MapInterceptor(ArenaTestimonial, ArenaTestimonialDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.arenaTestimonialsService.findOne({ id });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.ADMIN, RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(MapInterceptor(ArenaTestimonial, ArenaTestimonialDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id', IsCreatorPipe('ArenaTestimonial', 'id', 'creator')) id: string,
    @Body() updateArenaTestimonialDto: UpdateArenaTestimonialDto,
  ) {
    return this.arenaTestimonialsService.update(id, updateArenaTestimonialDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.arenaTestimonialsService.remove(id);
  }
}
