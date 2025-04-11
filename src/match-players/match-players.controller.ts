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
import { MatchPlayersService } from './match-players.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { matchPlayersPaginationConfig } from './config/match-players-pagination.config';
import { NullableType } from '../utils/types/nullable.type';
import { IsCreatorPipe } from '../utils/pipes/is-creator.pipe';
import { DeleteResult } from 'typeorm';
import { MatchPlayer } from './entities/match-players.entity';
import { MatchPlayerDto } from '@/domains/match-players/match-players.dto';
import { CreateMatchPlayerDto } from '@/domains/match-players/create-match-player.dto';
import { UpdateMatchPlayerDto } from '@/domains/match-players/update-match-player.dto';

@ApiTags('Match-Players')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'match-players' })
export class MatchPlayersController {
  constructor(
    private readonly matchPlayersService: MatchPlayersService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(MatchPlayer, MatchPlayerDto))
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post('matches/:matchId')
  async create(
    @Param('matchId') matchId: string,
    @Body() createMatchPlayerDto: CreateMatchPlayerDto,
  ): Promise<MatchPlayer> {
    return await this.matchPlayersService.create(matchId, createMatchPlayerDto);
  }

  @UseInterceptors(
    MapInterceptor(MatchPlayer, MatchPlayerDto, { isArray: true }),
  )
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post('matches/:matchId/bulk')
  async createMany(
    @Param('matchId') matchId: string,
    @Body() createMatchPlayerDtos: CreateMatchPlayerDto[],
  ): Promise<MatchPlayer[]> {
    return await this.matchPlayersService.createMany(
      matchId,
      createMatchPlayerDtos,
    );
  }

  @ApiPaginationQuery(matchPlayersPaginationConfig)
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.ADMIN, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<MatchPlayer, MatchPlayerDto>> {
    const matches = await this.matchPlayersService.findAll(query);
    return new PaginatedDto<MatchPlayer, MatchPlayerDto>(
      this.mapper,
      matches,
      MatchPlayer,
      MatchPlayerDto,
    );
  }

  @ApiPaginationQuery(matchPlayersPaginationConfig)
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<MatchPlayer, MatchPlayerDto>> {
    const matches = await this.matchPlayersService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<MatchPlayer, MatchPlayerDto>(
      this.mapper,
      matches,
      MatchPlayer,
      MatchPlayerDto,
    );
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(MatchPlayer, MatchPlayerDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<MatchPlayer>> {
    return await this.matchPlayersService.findOne({ id });
  }

  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(MatchPlayer, MatchPlayerDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id', IsCreatorPipe('Reservation', 'id', 'user')) id: string,
    @Body() updateMatchPlayerDto: UpdateMatchPlayerDto,
  ): Promise<MatchPlayer> {
    return await this.matchPlayersService.update(id, updateMatchPlayerDto);
  }

  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(
    @Param('id')
    id: string,
  ): Promise<DeleteResult> {
    return await this.matchPlayersService.remove(id);
  }
}
