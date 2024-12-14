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
  UploadedFile,
  Put,
} from '@nestjs/common';
import { TournamentService } from './tournament.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { CreateTournamentDto } from '@/domains/tournament/create-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { UpdateTournamentDto } from '@/domains/tournament/update-tournament.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { FileFastifyInterceptor, MulterFile } from 'fastify-file-interceptor';
import { TournamentDto } from '@/domains/tournament/tournament.dto';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { tournamentPaginationConfig } from './config/tournament-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';

@ApiTags('Tournament')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'tournaments' })
export class TournamentController {
  constructor(
    private readonly tournamentService: TournamentService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateTournamentDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(CreateTournamentDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.ADMIN)
  @UseInterceptors(MapInterceptor(Tournament, TournamentDto))
  @UseInterceptors(FileFastifyInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @Post('complex/:complexId')
  async create(
    @Param('complexId') complexId: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: MulterFile | Express.MulterS3.File,
  ): Promise<Tournament> {
    const createTournamentDto = new CreateTournamentDto(data);
    await Utils.validateDtoOrFail(createTournamentDto);
    return await this.tournamentService.create(
      complexId,
      createTournamentDto,
      file,
    );
  }

  @ApiPaginationQuery(tournamentPaginationConfig)
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Tournament, TournamentDto>> {
    const tournements = await this.tournamentService.findAll(query);
    return new PaginatedDto<Tournament, TournamentDto>(
      this.mapper,
      tournements,
      Tournament,
      TournamentDto,
    );
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @UseInterceptors(MapInterceptor(Tournament, TournamentDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<Tournament>> {
    return await this.tournamentService.findOne({ id });
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateTournamentDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(UpdateTournamentDto),
        },
      },
    },
  })
  @Roles(RoleCodeEnum.ADMIN)
  @UseInterceptors(MapInterceptor(Tournament, TournamentDto))
  @UseInterceptors(FileFastifyInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: MulterFile | Express.MulterS3.File,
  ): Promise<Tournament> {
    const updateTournamentDto = new UpdateTournamentDto(data);
    await Utils.validateDtoOrFail(updateTournamentDto);
    return this.tournamentService.update(id, updateTournamentDto, file);
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.SUPERADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.tournamentService.remove(id);
  }
}
