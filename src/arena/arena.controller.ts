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
  Put,
  UploadedFiles,
} from '@nestjs/common';
import { ArenaService } from './arena.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateArenaDto } from '@/domains/arena/create-arena.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Arena } from './entities/arena.entity';
import { ArenaDto } from '@/domains/arena/arena.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { UpdateArenaDto } from '@/domains/arena/update-arena.dto';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { NullableType } from '../utils/types/nullable.type';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Mapper } from 'automapper-core';
import { FilesFastifyInterceptor, MulterFile } from 'fastify-file-interceptor';
import { arenaPaginationConfig } from './config/arena-pagination-config';
import { DeleteResult } from 'typeorm';

@ApiTags('Arena')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'arenas' })
export class ArenaController {
  constructor(
    private readonly arenaService: ArenaService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateArenaDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          $ref: getSchemaPath(CreateArenaDto),
        },
      },
    },
  })
  @UseInterceptors(MapInterceptor(Arena, ArenaDto))
  @UseInterceptors(FilesFastifyInterceptor('files', 10))
  @Roles(RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post('complexes/:complexId')
  async create(
    @Param('complexId') complexId: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFiles() files?: Array<MulterFile | Express.MulterS3.File>,
  ): Promise<Arena> {
    const createArenaDto = new CreateArenaDto(data);
    await Utils.validateDtoOrFail(createArenaDto);
    return await this.arenaService.create(complexId, createArenaDto, files);
  }

  @ApiPaginationQuery(arenaPaginationConfig)
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Arena, ArenaDto>> {
    const arenas = await this.arenaService.findAll(query);
    return new PaginatedDto<Arena, ArenaDto>(
      this.mapper,
      arenas,
      Arena,
      ArenaDto,
    );
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(Arena, ArenaDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<Arena>> {
    return await this.arenaService.findOne({ id });
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateArenaDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        data: {
          $ref: getSchemaPath(UpdateArenaDto),
        },
      },
    },
  })
  @UseInterceptors(MapInterceptor(Arena, ArenaDto))
  @UseInterceptors(FilesFastifyInterceptor('files'))
  @Roles(RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFiles() files?: Array<MulterFile | Express.MulterS3.File>,
  ): Promise<Arena> {
    const updateArenaDto = new UpdateArenaDto(data);
    console.log('Arena-arena', data);
    await Utils.validateDtoOrFail(updateArenaDto);
    return this.arenaService.update(id, updateArenaDto, files);
  }

  @UseInterceptors(MapInterceptor(Arena, ArenaDto))
  @Roles(RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<DeleteResult> {
    return await this.arenaService.remove(id);
  }
}
