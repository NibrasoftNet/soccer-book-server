import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { TeamService } from './team.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { teamPaginationConfig } from './config/team-pagination-config';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Public } from '../utils/validators/public.decorator';
import { Utils } from '../utils/utils';
import { CreateTeamDto } from '@/domains/team/create-team.dto';
import { TeamDto } from '@/domains/team/team.dto';
import { Team } from './entities/team.entity';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { UpdateTeamDto } from '@/domains/team/update-team.dto';
import { FileFastifyInterceptor } from 'fastify-file-interceptor';

@ApiTags('Teams')
@ApiBearerAuth()
@Controller({ version: '1', path: 'teams' })
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateTeamDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(CreateTeamDto),
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Team, TeamDto))
  @UseInterceptors(FileFastifyInterceptor('file'))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Request() request,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFiles() file?: Express.Multer.File | Express.MulterS3.File,
  ) {
    const createTeamDto = new CreateTeamDto(data);
    await Utils.validateDtoOrFail(createTeamDto);
    return await this.teamService.create(request.user, createTeamDto, file);
  }

  @ApiPaginationQuery(teamPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Get('list/subscribed')
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Team, TeamDto>> {
    const teams = await this.teamService.findAll(query);
    return new PaginatedDto<Team, TeamDto>(this.mapper, teams, Team, TeamDto);
  }

  @ApiPaginationQuery(teamPaginationConfig)
  @Get('list/unsubscribed')
  @Public()
  @HttpCode(HttpStatus.OK)
  async findAllUnsubscribed(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Team, TeamDto>> {
    const teams = await this.teamService.findAll(query);
    return new PaginatedDto<Team, TeamDto>(this.mapper, teams, Team, TeamDto);
  }

  @ApiPaginationQuery(teamPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @Get('list/_me')
  @HttpCode(HttpStatus.OK)
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Team, TeamDto>> {
    const teams = await this.teamService.findAllMe(request.user, query);
    return new PaginatedDto<Team, TeamDto>(this.mapper, teams, Team, TeamDto);
  }

  @ApiPaginationQuery(teamPaginationConfig)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @Get('list/others')
  @HttpCode(HttpStatus.OK)
  async findAllOthers(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Team, TeamDto>> {
    const teams = await this.teamService.findAllOthers(request.user, query);
    return new PaginatedDto<Team, TeamDto>(this.mapper, teams, Team, TeamDto);
  }

  @ApiPaginationQuery(teamPaginationConfig)
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list-requested/_me')
  @HttpCode(HttpStatus.OK)
  async findAllRequestMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Team, TeamDto>> {
    const teams = await this.teamService.findAllRequestedMe(
      request.user,
      query,
    );
    return new PaginatedDto<Team, TeamDto>(this.mapper, teams, Team, TeamDto);
  }

  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Team, TeamDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.teamService.findOne(
      { id },
      {
        members: { member: true },
        creator: true,
      },
    );
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateTeamDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(UpdateTeamDto),
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Team, TeamDto))
  @UseInterceptors(FilesInterceptor('file'))
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFiles() file?: Express.Multer.File | Express.MulterS3.File,
  ) {
    const updateTeamDto = new UpdateTeamDto(data);
    await Utils.validateDtoOrFail(updateTeamDto);
    return this.teamService.update(id, updateTeamDto, file);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.teamService.remove(+id);
  }
}
