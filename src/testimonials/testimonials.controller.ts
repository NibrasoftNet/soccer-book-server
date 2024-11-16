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
import { TestimonialsService } from './testimonials.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { testimonialPaginationConfig } from './config/testimonial-pagination-config';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Testimonial } from './entities/testimonial.entity';
import { TestimonialDto } from '@/domains/testimonial/testimonial.dto';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { CreateTestimonialDto } from '@/domains/testimonial/create-testimonial.dto';
import { UpdateTestimonialDto } from '@/domains/testimonial/update-testimonial.dto';
import { IsCreatorPipe } from '../utils/pipes/is-creator.pipe';

@ApiTags('Testimonials')
@ApiBearerAuth()
@Controller({ version: '1', path: 'testimonials' })
export class TestimonialsController {
  constructor(
    private readonly testimonialsService: TestimonialsService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Testimonial, TestimonialDto))
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.ADMIN, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Request() request,
    @Body() createTestimonialDto: CreateTestimonialDto,
  ): Promise<Testimonial> {
    return await this.testimonialsService.create(
      request.user,
      createTestimonialDto,
    );
  }

  @ApiPaginationQuery(testimonialPaginationConfig)
  @UseInterceptors(
    MapInterceptor(Testimonial, TestimonialDto, { isArray: true }),
  )
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Testimonial, TestimonialDto>> {
    const testimonials = await this.testimonialsService.findAll(query);
    return new PaginatedDto<Testimonial, TestimonialDto>(
      this.mapper,
      testimonials,
      Testimonial,
      TestimonialDto,
    );
  }

  @UseInterceptors(MapInterceptor(Testimonial, TestimonialDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.testimonialsService.findOne({ id });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.ADMIN, RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(MapInterceptor(Testimonial, TestimonialDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id', IsCreatorPipe('Testimonial', 'id', 'creator')) id: string,
    @Body() updateTestimonialDto: UpdateTestimonialDto,
  ) {
    return this.testimonialsService.update(id, updateTestimonialDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.testimonialsService.remove(+id);
  }
}
