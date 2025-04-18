import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  LessThan,
  MoreThan,
  Not,
  Repository,
} from 'typeorm';
import { ArenaService } from '../arena/arena.service';
import { UsersService } from '../users/users.service';
import { Paginate, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { reservationPaginationConfig } from './config/reservation-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { ReservationTypeEnum } from '@/enums/reservation/reservation-type.enum';
import { UpdateReservationDto } from '@/domains/reservation/update-reservation.dto';
import { CreateReservationDto } from '@/domains/reservation/create-reservation.dto';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationDto } from '@/domains/notification/create-notification.dto';
import { NotificationTypeOfSendingEnum } from '@/enums/notification/notification-type-of-sending.enum';
import { UserDto } from '@/domains/user/user.dto';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { User } from '../users/entities/user.entity';
import { TeamService } from '../team/team.service';
import { CreateApprovedReservationDto } from '@/domains/reservation/create-approved-reservation.dto';
import { CreateUserDto } from '@/domains/user/create-user.dto';
import { nanoid } from 'nanoid';
import { plainToClass } from 'class-transformer';
import { Role } from '../roles/entities/role.entity';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { Status } from '../statuses/entities/status.entity';
import { StatusCodeEnum } from '@/enums/status/statuses.enum';
import { ReportReservationDto } from '@/domains/reservation/report-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly usersService: UsersService,
    private readonly arenaService: ArenaService,
    private readonly teamService: TeamService,
    private readonly notificationService: NotificationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  async create(
    userJwtPayload: JwtPayloadType,
    arenaId: string,
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { homeId, awayId, ...filteredReservationDto } = createReservationDto;
    const reservation = this.reservationRepository.create(
      filteredReservationDto as DeepPartial<Reservation>,
    );
    reservation.user = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    reservation.arena = await this.arenaService.findOneOrFail({
      id: arenaId,
    });
    if (homeId && awayId) {
      reservation.home = await this.teamService.findOneOrFail({
        id: homeId,
      });
      reservation.away = await this.teamService.findOneOrFail({
        id: awayId,
      });
    }
    return this.reservationRepository.save(reservation);
  }

  async createApprovedReservation(
    arenaId: string,
    createApprovedReservationDto: CreateApprovedReservationDto,
  ): Promise<Reservation> {
    return await this.reservationRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const { userName, ...filteredReservationDto } =
          createApprovedReservationDto;
        const reservation = entityManager.create(
          Reservation,
          filteredReservationDto as DeepPartial<Reservation>,
        );

        // 1. Create guest user and approved his reservation
        const randomId = nanoid();
        const guestUser = new CreateUserDto({
          userName: userName + '-' + 'guest' + '-' + randomId,
          email: `${userName}.guest${randomId}@tachkila.com`,
          role: plainToClass(Role, {
            id: RoleCodeEnum.USER,
            code: RoleCodeEnum.USER,
          }),
          status: plainToClass(Status, {
            id: StatusCodeEnum.INACTIVE,
            code: StatusCodeEnum.INACTIVE,
          }),
        });

        reservation.user = await this.usersService.create(guestUser);
        reservation.arena = await this.arenaService.findOneOrFail({
          id: arenaId,
        });
        reservation.status = ReservationTypeEnum.CONFIRMED;

        // Find overlapping reservations to be rejected
        const overlappingReservations = await entityManager.find(Reservation, {
          where: [
            {
              day: reservation.day,
              startHour: LessThan(reservation.endHour),
              endHour: MoreThan(reservation.startHour),
              id: Not(reservation.id),
            },
          ],
          relations: ['user'],
        });

        // Update the status of overlapping reservations in a single query
        await entityManager
          .createQueryBuilder(Reservation, 'reservation')
          .update()
          .set({ status: ReservationTypeEnum.REJECTED })
          .where('day = :day', { day: reservation.day })
          .andWhere('(startHour < :endHour AND endHour > :startHour)', {
            startHour: reservation.startHour,
            endHour: reservation.endHour,
          })
          .andWhere('id != :id', { id: reservation.id })
          .execute();

        if (overlappingReservations.length) {
          // Notify users of rejected reservations
          const rejectedUsers = overlappingReservations.map((overlap) =>
            this.mapper.map(overlap.user, User, UserDto),
          );

          const rejectionNotificationDto = new CreateNotificationDto({
            title: 'Reservation Rejected',
            message: 'Unfortunately, your reservation has been rejected.',
            forAllUsers: false,
            typeOfSending: NotificationTypeOfSendingEnum.IMMEDIATELY,
            users: rejectedUsers,
          });
          await this.notificationService.create(rejectionNotificationDto);
        }

        return entityManager.save(reservation);
      },
    );
  }

  async findAll(query: PaginateQuery): Promise<Paginated<Reservation>> {
    return await paginate<Reservation>(
      query,
      this.reservationRepository,
      reservationPaginationConfig,
    );
  }

  async findAllMe(
    userJwtPayload: JwtPayloadType,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Reservation>> {
    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.arena', 'arena')
      .leftJoinAndSelect('reservation.home', 'home')
      .leftJoinAndSelect('reservation.away', 'away')
      .where('user.id = :id', { id: userJwtPayload.id });

    return await paginate<Reservation>(
      query,
      queryBuilder,
      reservationPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<Reservation>,
    relations?: FindOptionsRelations<Reservation>,
  ): Promise<NullableType<Reservation>> {
    return await this.reservationRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<Reservation>,
    relations?: FindOptionsRelations<Reservation>,
  ): Promise<Reservation> {
    return await this.reservationRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOneOrFail({ id });
    Object.assign(reservation, updateReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  async approveReservation(id: string): Promise<Reservation> {
    return await this.reservationRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Find the reservation to approve
        const reservation = await entityManager.findOneOrFail(Reservation, {
          where: { id },
          relations: ['user'],
        });
        // Find overlapping reservations to be rejected
        await this.handleOverlappingReservations({
          entityManager,
          id,
          day: reservation.day,
          startHour: reservation.startHour,
          endHour: reservation.endHour,
          status: ReservationTypeEnum.REJECTED,
        });
        // Approve the current reservation
        reservation.status = ReservationTypeEnum.CONFIRMED;
        const mappedUser = this.mapper.map(reservation.user, User, UserDto);
        if (mappedUser.notificationsToken) {
          const createNotificationDto = new CreateNotificationDto({
            title: 'Reservation Approved',
            message: 'Your reservation has been approved',
            forAllUsers: false,
            typeOfSending: NotificationTypeOfSendingEnum.IMMEDIATELY,
            users: [mappedUser],
          });
          await this.notificationService.create(createNotificationDto);
        }
        return await entityManager.save(Reservation, reservation);
      },
    );
  }

  async reportReservation(
    id: string,
    reportReservationDto: ReportReservationDto,
  ): Promise<Reservation> {
    return await this.reservationRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Find the reservation to approve
        const reservation = await entityManager.findOneOrFail(Reservation, {
          where: { id, status: ReservationTypeEnum.CONFIRMED },
          relations: ['user'],
        });
        // Update the status of OLD overlapping reservations in a single query
        await this.handleOverlappingReservations({
          entityManager,
          id,
          day: reservation.day,
          startHour: reservation.startHour,
          endHour: reservation.endHour,
          status: ReservationTypeEnum.PENDING,
        });
        Object.assign(reservation, reportReservationDto);
        // Approve the current reservation
        reservation.status = ReservationTypeEnum.CONFIRMED;
        const mappedUser = this.mapper.map(reservation.user, User, UserDto);
        if (mappedUser.notificationsToken) {
          const createNotificationDto = new CreateNotificationDto({
            title: 'Reported Reservation',
            message: 'Your reservation has been reported',
            forAllUsers: false,
            typeOfSending: NotificationTypeOfSendingEnum.IMMEDIATELY,
            users: [mappedUser],
          });
          await this.notificationService.create(createNotificationDto);
        }
        // Update the status of NEW overlapping reservations in a single query
        await this.handleOverlappingReservations({
          entityManager,
          id,
          day: reportReservationDto.day,
          startHour: reportReservationDto.startHour,
          endHour: reportReservationDto.endHour,
          status: ReservationTypeEnum.REJECTED,
        });
        return await entityManager.save(Reservation, reservation);
      },
    );
  }

  async remove(id: string) {
    return await this.reservationRepository.delete(id);
  }

  private async handleOverlappingReservations({
    entityManager,
    id,
    day,
    startHour,
    endHour,
    status,
  }: {
    entityManager: EntityManager;
    id: string;
    day: Date;
    startHour: string;
    endHour: string;
    status: ReservationTypeEnum;
  }): Promise<void> {
    // Find overlapping reservations to be rejected
    const overlappingReservations = await entityManager.find(Reservation, {
      where: [
        {
          day,
          startHour: LessThan(endHour),
          endHour: MoreThan(startHour),
          id: Not(id),
        },
      ],
      relations: ['user'],
    });

    // Update the status of overlapping reservations in a single query
    await entityManager
      .createQueryBuilder(Reservation, 'reservation')
      .update()
      .set({ status })
      .where('day = :day', { day })
      .andWhere('(startHour < :endHour AND endHour > :startHour)', {
        startHour,
        endHour,
      })
      .andWhere('id != :id', { id })
      .execute();

    if (overlappingReservations.length) {
      // Notify users of rejected reservations
      const overlapUsers = overlappingReservations.map((overlap) =>
        this.mapper.map(overlap.user, User, UserDto),
      );

      const rejectionNotificationDto = new CreateNotificationDto({
        title:
          status === ReservationTypeEnum.REJECTED
            ? 'Reservation Rejected'
            : 'Reservation Pending',
        message:
          status === ReservationTypeEnum.REJECTED
            ? 'Unfortunately, your Reservation has been Rejected'
            : 'Your reservation is pending',
        forAllUsers: false,
        typeOfSending: NotificationTypeOfSendingEnum.IMMEDIATELY,
        users: overlapUsers,
      });
      await this.notificationService.create(rejectionNotificationDto);
    }
  }
}
