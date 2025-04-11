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
import { MatchService } from './match.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { matchPaginationConfig } from './config/match-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { IsCreatorPipe } from '../utils/pipes/is-creator.pipe';
import { DeleteResult } from 'typeorm';
import { Match } from './entities/match.entity';
import { MatchDto } from '@/domains/match/match.dto';
import { CreateMatchDto } from '@/domains/match/create-match.dto';
import { UpdateMatchDto } from '@/domains/match/update-match.dto';

@ApiTags('Matches')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'matches' })
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(Match, MatchDto))
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createMatchDto: CreateMatchDto): Promise<Match> {
    return await this.matchService.create(createMatchDto);
  }

  @ApiPaginationQuery(matchPaginationConfig)
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.ADMIN, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Match, MatchDto>> {
    const matches = await this.matchService.findAll(query);
    return new PaginatedDto<Match, MatchDto>(
      this.mapper,
      matches,
      Match,
      MatchDto,
    );
  }

  @ApiPaginationQuery(matchPaginationConfig)
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Match, MatchDto>> {
    const matches = await this.matchService.findAllMe(request.user, query);
    return new PaginatedDto<Match, MatchDto>(
      this.mapper,
      matches,
      Match,
      MatchDto,
    );
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(Match, MatchDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<Match>> {
    return await this.matchService.findOne({ id });
  }

  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(Match, MatchDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<Match> {
    return await this.matchService.update(id, updateMatchDto);
  }

  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(
    @Param('id', IsCreatorPipe('TeamReservation', 'id', 'home.creator'))
    id: string,
  ): Promise<DeleteResult> {
    return await this.matchService.remove(id);
  }
}
