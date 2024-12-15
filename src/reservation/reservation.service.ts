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

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly usersService: UsersService,
    private readonly arenaService: ArenaService,
    private readonly notificationService: NotificationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  async create(
    userJwtPayload: JwtPayloadType,
    arenaId: string,
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const reservation = this.reservationRepository.create(
      createReservationDto as DeepPartial<Reservation>,
    );
    reservation.user = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    reservation.arena = await this.arenaService.findOneOrFail({
      id: arenaId,
    });
    return this.reservationRepository.save(reservation);
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
  ) {
    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.creator', 'creator')
      .where('creator.id = :id', { id: userJwtPayload.id });

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
          .createQueryBuilder()
          .update(Reservation)
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

        // Approve the current reservation
        reservation.status = ReservationTypeEnum.CONFIRMED;
        const mappedUser = this.mapper.map(reservation.user, User, UserDto);
        const createNotificationDto = new CreateNotificationDto({
          title: 'Approved',
          message: 'Your reservation has been approved',
          forAllUsers: false,
          typeOfSending: NotificationTypeOfSendingEnum.IMMEDIATELY,
          users: [mappedUser],
        });
        await this.notificationService.create(createNotificationDto);
        return await entityManager.save(Reservation, reservation);
      },
    );
  }

  async remove(id: string) {
    return await this.reservationRepository.delete(id);
  }
}
