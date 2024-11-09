import { WinstonLoggerService } from '../logger/winston-logger.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Notification } from './entities/notification.entity';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { Mapper } from 'automapper-core';
import { notificationsPaginationConfig } from './configs/notifications-pagination.config';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { CreateNotificationDto } from '@/domains/notification/dto/create-notification.dto';
import { NotificationDto } from '@/domains/notification/dto/notification.dto';
import { UpdateNotificationDto } from '@/domains/notification/dto/update-notification.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Notifications')
@Controller({ path: 'notifications', version: '1' })
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: WinstonLoggerService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Post()
  @UseInterceptors(MapInterceptor(Notification, NotificationDto))
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return await this.notificationService.create(createNotificationDto);
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    MapInterceptor(Notification, NotificationDto, { isArray: true }),
  )
  @ApiPaginationQuery(notificationsPaginationConfig)
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Notification, NotificationDto>> {
    const notifications =
      await this.notificationService.findAllPaginated(query);
    return new PaginatedDto<Notification, NotificationDto>(
      this.mapper,
      notifications,
      Notification,
      NotificationDto,
    );
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Get('all/_me')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    MapInterceptor(Notification, NotificationDto, { isArray: true }),
  )
  @ApiPaginationQuery(notificationsPaginationConfig)
  async findAllMyNotifications(
    @Request() request: any,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Notification, NotificationDto>> {
    const notifications = await this.notificationService.findAllMyNotifications(
      request.user,
      query,
    );
    return new PaginatedDto<Notification, NotificationDto>(
      this.mapper,
      notifications,
      Notification,
      NotificationDto,
    );
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Get(':id')
  @UseInterceptors(MapInterceptor(Notification, NotificationDto))
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.notificationService.findOne({ id }, { users: true });
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @ApiQuery({ name: 'userId', required: false })
  @Get('send/:id')
  @HttpCode(HttpStatus.OK)
  async sendNotification(@Param('id') id: string) {
    return await this.notificationService.sendPushNotifications(id);
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Notification, NotificationDto))
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification> {
    return await this.notificationService.update(id, updateNotificationDto);
  }

  @Roles(RoleCodeEnum.ADMIN, RoleCodeEnum.USER, RoleCodeEnum.SUPERADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.notificationService.remove(id);
  }
}
