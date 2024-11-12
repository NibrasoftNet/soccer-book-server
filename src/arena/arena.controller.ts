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
  Request,
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
import { FilesInterceptor } from '@nestjs/platform-express';
import { Arena } from './entities/arena.entity';
import { ArenaDto } from '@/domains/arena/arena.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { UpdateArenaDto } from '@/domains/arena/update-arena.dto';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { NullableType } from '../utils/types/nullable.type';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Mapper } from 'automapper-core';

@ApiTags('Arena')
@ApiBearerAuth()
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Arena, ArenaDto))
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Request() request,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ) {
    const createArenaDto = new CreateArenaDto(data);
    await Utils.validateDtoOrFail(createArenaDto);
    return await this.arenaService.create(request.user, createArenaDto, files);
  }

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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Arena, ArenaDto))
  @UseInterceptors(FilesInterceptor('files'))
  @Roles(RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFiles() files?: Array<Express.Multer.File | Express.MulterS3.File>,
  ): Promise<Arena> {
    const updateArenaDto = new UpdateArenaDto(data);
    await Utils.validateDtoOrFail(updateArenaDto);
    return this.arenaService.update(id, updateArenaDto, files);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @UseInterceptors(MapInterceptor(Arena, ArenaDto))
  @Roles(RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.arenaService.remove(id);
  }
}
