import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { User } from './entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateResult } from 'typeorm';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { usersPaginationConfig } from './configs/users-pagination.config';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { UserDto } from '@/domains/user/user.dto';
import { CreateUserDto } from '@/domains/user/create-user.dto';
import { UpdateUserDto } from '@/domains/user/update-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Roles(RoleCodeEnum.ADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(MapInterceptor(User, UserDto))
  async create(@Body() createProfileDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createProfileDto);
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.SUPERADMIN, RoleCodeEnum.USER)
  @Get()
  @HttpCode(HttpStatus.OK)
  @PaginatedSwaggerDocs(UserDto, usersPaginationConfig)
  async findAllPaginated(@Paginate() query: PaginateQuery) {
    const users = await this.usersService.findManyWithPagination(query);
    return new PaginatedDto<User, UserDto>(this.mapper, users, User, UserDto);
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(User, UserDto))
  async findOne(@Param('id') id: string): Promise<NullableType<User>> {
    return await this.usersService.findOne({ id });
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(User, UserDto))
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateProfileDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateProfileDto);
  }

  @Roles(RoleCodeEnum.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<UpdateResult> {
    return await this.usersService.softDelete(id);
  }
}
