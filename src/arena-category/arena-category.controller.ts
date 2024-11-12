import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ArenaCategoryService } from './arena-category.service';
import {
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { Mapper } from 'automapper-core';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { arenaCategoryPaginationConfig } from './config/arena-category-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { Roles } from '../roles/roles.decorator';
import { CreateArenaCategoryDto } from '@/domains/area-category/create-arena-category.dto';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { ArenaCategory } from './entities/arena-category.entity';
import { Utils } from '../utils/utils';
import { ArenaCategoryDto } from '@/domains/area-category/arena-category.dto';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { UpdateArenaCategoryDto } from '@/domains/area-category/update-arena-category.dto';
import { FileFastifyInterceptor, MulterFile } from 'fastify-file-interceptor';

@ApiTags('Arena-Category')
@Controller({ version: '1', path: 'arena-categories' })
export class ArenaCategoryController {
  constructor(
    private readonly arenaCategoryService: ArenaCategoryService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateArenaCategoryDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(CreateArenaCategoryDto),
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(MapInterceptor(ArenaCategory, ArenaCategoryDto))
  @UseInterceptors(FileFastifyInterceptor('file'))
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: MulterFile | Express.MulterS3.File,
  ): Promise<ArenaCategory> {
    const createArenaCategoryDto = new CreateArenaCategoryDto(data);
    await Utils.validateDtoOrFail(createArenaCategoryDto);
    return await this.arenaCategoryService.create(createArenaCategoryDto, file);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginationQuery(arenaCategoryPaginationConfig)
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<ArenaCategory, ArenaCategoryDto>> {
    const categories = await this.arenaCategoryService.findAll(query);
    return new PaginatedDto<ArenaCategory, ArenaCategoryDto>(
      this.mapper,
      categories,
      ArenaCategory,
      ArenaCategoryDto,
    );
  }

  @Get('find/all-categories')
  @HttpCode(HttpStatus.OK)
  async findAllCategories() {
    return await this.arenaCategoryService.findAllCategories();
  }

  @Roles(RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER, RoleCodeEnum.ADMIN)
  @UseInterceptors(MapInterceptor(ArenaCategory, ArenaCategoryDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<ArenaCategory>> {
    return await this.arenaCategoryService.findOne({ id }, { arenas: true });
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateArenaCategoryDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(UpdateArenaCategoryDto),
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(MapInterceptor(ArenaCategory, ArenaCategoryDto))
  @UseInterceptors(FileFastifyInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<ArenaCategory> {
    const updateAreaCategoryDto = new UpdateArenaCategoryDto(data);
    await Utils.validateDtoOrFail(updateAreaCategoryDto);
    return await this.arenaCategoryService.update(
      id,
      updateAreaCategoryDto,
      file,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.arenaCategoryService.remove(id);
  }
}
