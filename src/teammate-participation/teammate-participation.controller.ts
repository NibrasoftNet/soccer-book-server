import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { TeammateParticipationService } from './teammate-participation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { TeammateParticipation } from './entities/teammate-participation.entity';
import { TeammateParticipationDto } from '@/domains/teammate-paticipation/teammate-participation.dto';
import { Mapper } from 'automapper-core';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { teammatePaginationConfig } from '../teammate/config/teammate-pagination-config';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { UpdateTeammateParticipationDto } from '@/domains/teammate-paticipation/update-teammate-participation.dto';
import { NullableType } from '../utils/types/nullable.type';

@ApiBearerAuth()
@ApiTags('Teammate-participations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'teammate-participations' })
export class TeammateParticipationController {
  constructor(
    private readonly teammateParticipationService: TeammateParticipationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(
    MapInterceptor(TeammateParticipation, TeammateParticipationDto),
  )
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post('teammate/:teammateId')
  async create(
    @Request() request,
    @Param('teammateId') teammateId: string,
  ): Promise<TeammateParticipation> {
    return await this.teammateParticipationService.create(
      request.user,
      teammateId,
    );
  }

  @ApiPaginationQuery(teammatePaginationConfig)
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<TeammateParticipation, TeammateParticipationDto>> {
    const teammates = await this.teammateParticipationService.findAll(query);
    return new PaginatedDto<TeammateParticipation, TeammateParticipationDto>(
      this.mapper,
      teammates,
      TeammateParticipation,
      TeammateParticipationDto,
    );
  }

  @ApiPaginationQuery(teammatePaginationConfig)
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('list/_me')
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<TeammateParticipation, TeammateParticipationDto>> {
    const teammates = await this.teammateParticipationService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<TeammateParticipation, TeammateParticipationDto>(
      this.mapper,
      teammates,
      TeammateParticipation,
      TeammateParticipationDto,
    );
  }

  @UseInterceptors(
    MapInterceptor(TeammateParticipation, TeammateParticipationDto),
  )
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<TeammateParticipation>> {
    return await this.teammateParticipationService.findOne({ id });
  }

  @UseInterceptors(
    MapInterceptor(TeammateParticipation, TeammateParticipationDto),
  )
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTeammateParticipationDto: UpdateTeammateParticipationDto,
  ): Promise<TeammateParticipation> {
    return await this.teammateParticipationService.update(
      id,
      updateTeammateParticipationDto,
    );
  }

  @UseInterceptors(
    MapInterceptor(TeammateParticipation, TeammateParticipationDto),
  )
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.teammateParticipationService.remove(id);
  }
}
