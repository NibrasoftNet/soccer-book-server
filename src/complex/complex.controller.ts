import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Put,
  Request,
  UploadedFile,
} from '@nestjs/common';
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
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { NullableType } from '../utils/types/nullable.type';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Mapper } from 'automapper-core';
import { FileFastifyInterceptor, MulterFile } from 'fastify-file-interceptor';
import { IsCreatorPipe } from '../utils/pipes/is-creator.pipe';
import { ProximityQueryDto } from '@/domains/complex/proximity-query.dto';
import { DeleteResult } from 'typeorm';
import { ComplexService } from './complex.service';
import { CreateComplexDto } from '@/domains/complex/create-complex.dto';
import { Complex } from './entities/complex.entity';
import { ComplexDto } from '@/domains/complex/complex.dto';
import { complexPaginationConfig } from './config/complex-pagination-config';
import { UpdateComplexDto } from '@/domains/complex/update-complex.dto';

@ApiTags('Complex')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'complexes' })
export class ComplexController {
  constructor(
    private readonly complexService: ComplexService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(CreateComplexDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(CreateComplexDto),
        },
      },
    },
  })
  @UseInterceptors(MapInterceptor(Complex, ComplexDto))
  @UseInterceptors(FileFastifyInterceptor('file'))
  @Roles(RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @Request() request,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: MulterFile | Express.MulterS3.File,
  ) {
    const createComplexDto = new CreateComplexDto(data);
    await Utils.validateDtoOrFail(createComplexDto);
    return await this.complexService.create(
      request.user,
      createComplexDto,
      file,
    );
  }

  @ApiPaginationQuery(complexPaginationConfig)
  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Complex, ComplexDto>> {
    const complexes = await this.complexService.findAll(query);
    return new PaginatedDto<Complex, ComplexDto>(
      this.mapper,
      complexes,
      Complex,
      ComplexDto,
    );
  }

  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(Complex, ComplexDto, { isArray: true }))
  @HttpCode(HttpStatus.OK)
  @Get('list-with-distance')
  async findAllWithDistance(
    @Query() proximityQueryDto: ProximityQueryDto,
  ): Promise<ComplexDto[]> {
    const complexes =
      await this.complexService.findAllWithDistance(proximityQueryDto);
    return this.mapper.mapArray(complexes, Complex, ComplexDto);
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(Complex, ComplexDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<Complex>> {
    return await this.complexService.findOne({ id });
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(UpdateComplexDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(UpdateComplexDto),
        },
      },
    },
  })
  @UseInterceptors(MapInterceptor(Complex, ComplexDto))
  @UseInterceptors(FileFastifyInterceptor('file'))
  @Roles(RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id', IsCreatorPipe('Complex', 'id', 'creator')) id: string,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: MulterFile | Express.MulterS3.File,
  ): Promise<Complex> {
    const updateComplexDto = new UpdateComplexDto(data);
    await Utils.validateDtoOrFail(updateComplexDto);
    return this.complexService.update(id, updateComplexDto, file);
  }

  @Roles(RoleCodeEnum.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(
    @Param('id', IsCreatorPipe('Complex', 'id', 'creator')) id: string,
  ): Promise<DeleteResult> {
    return await this.complexService.remove(id);
  }
}
