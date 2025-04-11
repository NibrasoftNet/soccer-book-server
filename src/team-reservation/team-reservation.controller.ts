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
import { TeamReservationService } from './team-reservation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { teamReservationPaginationConfig } from './config/team-reservation-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { IsCreatorPipe } from '../utils/pipes/is-creator.pipe';
import { TeamReservation } from './entities/team-reservation.entity';
import { TeamReservationDto } from '@/domains/team-reservation/team-reservation.dto';
import { CreateTeamReservationDto } from '@/domains/team-reservation/create-team-reservation.dto';
import { UpdateTeamReservationDto } from '@/domains/team-reservation/update-team-reservation.dto';
import { DeleteResult } from 'typeorm';

@ApiTags('Team-Reservation')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'team-reservations' })
export class TeamReservationController {
  constructor(
    private readonly teamReservationService: TeamReservationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(TeamReservation, TeamReservationDto))
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post('/homes/:homeId/aways/:awayId/arenas/:arenaId')
  async create(
    @Param('homeId') homeId: string,
    @Param('awayId') awayId: string,
    @Param('arenaId') arenaId: string,
    @Body() createTeamReservationDto: CreateTeamReservationDto,
  ): Promise<TeamReservation> {
    return await this.teamReservationService.create(
      homeId,
      awayId,
      arenaId,
      createTeamReservationDto,
    );
  }

  @ApiPaginationQuery(teamReservationPaginationConfig)
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.ADMIN, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<TeamReservation, TeamReservationDto>> {
    const reservations = await this.teamReservationService.findAll(query);
    return new PaginatedDto<TeamReservation, TeamReservationDto>(
      this.mapper,
      reservations,
      TeamReservation,
      TeamReservationDto,
    );
  }

  @ApiPaginationQuery(teamReservationPaginationConfig)
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<TeamReservation, TeamReservationDto>> {
    const reservations = await this.teamReservationService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<TeamReservation, TeamReservationDto>(
      this.mapper,
      reservations,
      TeamReservation,
      TeamReservationDto,
    );
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(TeamReservation, TeamReservationDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<TeamReservation>> {
    return await this.teamReservationService.findOne({ id });
  }

  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(TeamReservation, TeamReservationDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id', IsCreatorPipe('Reservation', 'id', 'user')) id: string,
    @Body() updateTeamReservationDto: UpdateTeamReservationDto,
  ): Promise<TeamReservation> {
    return await this.teamReservationService.update(
      id,
      updateTeamReservationDto,
    );
  }

  @Roles(RoleCodeEnum.ADMIN)
  @UseInterceptors(MapInterceptor(TeamReservation, TeamReservationDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id/approve')
  async approveReservation(@Param('id') id: string): Promise<TeamReservation> {
    return await this.teamReservationService.approveReservation(id);
  }

  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(
    @Param('id', IsCreatorPipe('TeamReservation', 'id', 'home.creator'))
    id: string,
  ): Promise<DeleteResult> {
    return await this.teamReservationService.remove(id);
  }
}
