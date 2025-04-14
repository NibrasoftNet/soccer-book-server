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
  Request,
  Put,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { Reservation } from './entities/reservation.entity';
import { ReservationDto } from '@/domains/reservation/reservation.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { ApiPaginationQuery, Paginate, PaginateQuery } from 'nestjs-paginate';
import { PaginatedDto } from '../utils/serialization/paginated.dto';
import { reservationPaginationConfig } from './config/reservation-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { IsCreatorPipe } from '../utils/pipes/is-creator.pipe';
import { CreateReservationDto } from '@/domains/reservation/create-reservation.dto';
import { UpdateReservationDto } from '@/domains/reservation/update-reservation.dto';
import { DeleteResult } from 'typeorm';

@ApiTags('Reservation')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ version: '1', path: 'reservations' })
export class ReservationController {
  constructor(
    private readonly reservationService: ReservationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(Reservation, ReservationDto))
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.CREATED)
  @Post('/arenas/:arenaId')
  async create(
    @Request() request,
    @Param('arenaId') arenaId: string,
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    return await this.reservationService.create(
      request.user,
      arenaId,
      createReservationDto,
    );
  }

  @ApiPaginationQuery(reservationPaginationConfig)
  @Roles(RoleCodeEnum.USER, RoleCodeEnum.ADMIN, RoleCodeEnum.SUPERADMIN)
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Reservation, ReservationDto>> {
    const reservations = await this.reservationService.findAll(query);
    return new PaginatedDto<Reservation, ReservationDto>(
      this.mapper,
      reservations,
      Reservation,
      ReservationDto,
    );
  }

  @ApiPaginationQuery(reservationPaginationConfig)
  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Get('me')
  async findAllMe(
    @Request() request,
    @Paginate() query: PaginateQuery,
  ): Promise<PaginatedDto<Reservation, ReservationDto>> {
    const reservations = await this.reservationService.findAllMe(
      request.user,
      query,
    );
    return new PaginatedDto<Reservation, ReservationDto>(
      this.mapper,
      reservations,
      Reservation,
      ReservationDto,
    );
  }

  @Roles(RoleCodeEnum.USER, RoleCodeEnum.ADMIN, RoleCodeEnum.SUPERADMIN)
  @UseInterceptors(MapInterceptor(Reservation, ReservationDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<Reservation>> {
    return await this.reservationService.findOne({ id });
  }

  @Roles(RoleCodeEnum.USER)
  @UseInterceptors(MapInterceptor(Reservation, ReservationDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    return await this.reservationService.update(id, updateReservationDto);
  }

  @Roles(RoleCodeEnum.ADMIN)
  @UseInterceptors(MapInterceptor(Reservation, ReservationDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id/approve')
  async approveReservation(@Param('id') id: string): Promise<Reservation> {
    return await this.reservationService.approveReservation(id);
  }

  @Roles(RoleCodeEnum.USER)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(
    @Param('id', IsCreatorPipe('Reservation', 'id', 'creator')) id: string,
  ): Promise<DeleteResult> {
    return await this.reservationService.remove(id);
  }
}
