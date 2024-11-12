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
import { UsersAdminService } from './users-admin.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateResult } from 'typeorm';
import { Paginate, PaginatedSwaggerDocs, PaginateQuery } from 'nestjs-paginate';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { UserAdmin } from './entities/user-admin.entity';
import { usersAdminPaginationConfig } from './configs/users-admin-pagination.config';
import { UserAdminDto } from '@/domains/user-admin/user-admin.dto';
import { CreateUserAdminDto } from '@/domains/user-admin/create-user-admin.dto';
import { UpdateUserAdminDto } from '@/domains/user-admin/update-user-admin.dto';

@ApiBearerAuth()
@ApiTags('Admin-Users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({
  path: 'admin-users',
  version: '1',
})
export class UsersAdminController {
  constructor(
    private readonly usersAdminService: UsersAdminService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(MapInterceptor(UserAdmin, UserAdminDto))
  async create(
    @Body() createProfileDto: CreateUserAdminDto,
  ): Promise<UserAdmin> {
    return await this.usersAdminService.create(createProfileDto);
  }

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @PaginatedSwaggerDocs(UserAdminDto, usersAdminPaginationConfig)
  async findAllPaginated(@Paginate() query: PaginateQuery) {
    const users = await this.usersAdminService.findManyWithPagination(query);
    return new PaginatedDto<UserAdmin, UserAdminDto>(
      this.mapper,
      users,
      UserAdmin,
      UserAdminDto,
    );
  }

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(UserAdmin, UserAdminDto))
  async findOne(@Param('id') id: string): Promise<NullableType<UserAdmin>> {
    return await this.usersAdminService.findOne({ id });
  }

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(UserAdmin, UserAdminDto))
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateProfileDto: UpdateUserAdminDto,
  ): Promise<UserAdmin> {
    return await this.usersAdminService.update(id, updateProfileDto);
  }

  @Roles(RoleCodeEnum.SUPERADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<UpdateResult> {
    return await this.usersAdminService.softDelete(id);
  }
}
