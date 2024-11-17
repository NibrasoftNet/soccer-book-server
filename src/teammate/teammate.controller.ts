import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Request,
  Put,
} from '@nestjs/common';
import { TeammateService } from './teammate.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { TeammateDto } from '@/domains/teammate/teammate.dto';
import { Teammate } from './entities/teammate.entity';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { CreateTeammateDto } from '@/domains/teammate/create-teammate.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { teammatePaginationConfig } from './config/teammate-pagination-config';
import { UpdateTeammateDto } from '@/domains/teammate/update-teammate.dto';
import { IsCreatorPipe } from '../utils/pipes/is-creator.pipe';
import { NullableType } from '../utils/types/nullable.type';

@ApiTags('Teamamte')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'teammates' })
export class TeammateController {
  constructor(
    private readonly teammateService: TeammateService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(Teammate, TeammateDto))
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post('arenas/:arenaId')
  async create(
    @Request() request,
    @Param('arenaId') arenaId: string,
    @Body() createTeammateDto: CreateTeammateDto,
  ): Promise<Teammate> {
    return await this.teammateService.create(
      request.user,
      arenaId,
      createTeammateDto,
    );
  }

  @ApiPaginationQuery(teammatePaginationConfig)
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Teammate, TeammateDto>> {
    const teammates = await this.teammateService.findAll(query);
    return new PaginatedDto<Teammate, TeammateDto>(
      this.mapper,
      teammates,
      Teammate,
      TeammateDto,
    );
  }

  @ApiPaginationQuery(teammatePaginationConfig)
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get('list/_me')
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Teammate, TeammateDto>> {
    const teammates = await this.teammateService.findAllMe(request.user, query);
    return new PaginatedDto<Teammate, TeammateDto>(
      this.mapper,
      teammates,
      Teammate,
      TeammateDto,
    );
  }

  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @UseInterceptors(MapInterceptor(Teammate, TeammateDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<Teammate>> {
    return this.teammateService.findOne({ id });
  }

  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(Teammate, TeammateDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id', IsCreatorPipe('Teammate', 'id', 'creator')) id: string,
    @Body() updateTeammateDto: UpdateTeammateDto,
  ): Promise<Teammate> {
    return this.teammateService.update(id, updateTeammateDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.teammateService.remove(id);
  }
}
