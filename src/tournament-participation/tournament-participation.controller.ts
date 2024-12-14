import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Put,
  Query,
  ParseEnumPipe,
} from '@nestjs/common';
import { TournamentParticipationService } from './tournament-participation.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { TournamentParticipation } from './entities/tournament-participation.entity';
import { TournamentParticipationDto } from '@/domains/tournament-participation/tournament-participation.dto';
import { Mapper } from 'automapper-core';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';
import { ParticipationStatusEnum } from '@/enums/tournament-participation/participation-status.enum';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { tournamentParticipationPaginateConfig } from './config/tournament-participation-pagination-config';
import { PaginatedDto } from '../utils/serialization/paginated.dto';

@ApiTags('Tournament-Participation')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'tournament-participation', version: '1' })
export class TournamentParticipationController {
  constructor(
    private readonly tournamentParticipationService: TournamentParticipationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(
    MapInterceptor(TournamentParticipation, TournamentParticipationDto),
  )
  @HttpCode(HttpStatus.CREATED)
  @Post('tournaments/:tournamentId/teams/:teamId')
  create(
    @Param('tournamentId') tournamentId: string,
    @Param('teamId') teamId: string,
  ): Promise<TournamentParticipation> {
    return this.tournamentParticipationService.create(tournamentId, teamId);
  }

  @ApiPaginationQuery(tournamentParticipationPaginateConfig)
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<
    PaginatedDto<TournamentParticipation, TournamentParticipationDto>
  > {
    const participations =
      await this.tournamentParticipationService.findAll(query);

    return new PaginatedDto<
      TournamentParticipation,
      TournamentParticipationDto
    >(
      this.mapper,
      participations,
      TournamentParticipation,
      TournamentParticipationDto,
    );
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @UseInterceptors(
    MapInterceptor(TournamentParticipation, TournamentParticipationDto),
  )
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<NullableType<TournamentParticipation>> {
    return await this.tournamentParticipationService.findOne({ id });
  }

  @ApiQuery({
    name: 'status',
    enum: ParticipationStatusEnum,
    description: 'Participation status to update',
    required: true,
  })
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @UseInterceptors(
    MapInterceptor(TournamentParticipation, TournamentParticipationDto),
  )
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Query('status', new ParseEnumPipe(ParticipationStatusEnum))
    status: ParticipationStatusEnum,
  ): Promise<TournamentParticipation> {
    return await this.tournamentParticipationService.handleParticipationStatus(
      id,
      status,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.tournamentParticipationService.remove(id);
  }
}
