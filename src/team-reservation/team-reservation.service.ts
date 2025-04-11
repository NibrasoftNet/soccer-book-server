import { Injectable } from '@nestjs/common';
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
import { Paginate, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { teamReservationPaginationConfig } from './config/team-reservation-pagination-config';
import { NullableType } from '../utils/types/nullable.type';
import { ReservationTypeEnum } from '@/enums/reservation/reservation-type.enum';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationDto } from '@/domains/notification/create-notification.dto';
import { NotificationTypeOfSendingEnum } from '@/enums/notification/notification-type-of-sending.enum';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { CreateTeamReservationDto } from '@/domains/team-reservation/create-team-reservation.dto';
import { TeamReservation } from './entities/team-reservation.entity';
import { TeamService } from '../team/team.service';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { UpdateTeamReservationDto } from '@/domains/team-reservation/update-team-reservation.dto';
import { Reservation } from '../reservation/entities/reservation.entity';
import { User } from '../users/entities/user.entity';
import { UserDto } from '@/domains/user/user.dto';

@Injectable()
export class TeamReservationService {
  constructor(
    @InjectRepository(TeamReservation)
    private readonly teamReservationRepository: Repository<TeamReservation>,
    private readonly teamService: TeamService,
    private readonly arenaService: ArenaService,
    private readonly notificationService: NotificationService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}
  async create(
    homeId: string,
    awayId: string,
    arenaId: string,
    createTeamReservationDto: CreateTeamReservationDto,
  ): Promise<TeamReservation> {
    const reservation = this.teamReservationRepository.create(
      createTeamReservationDto as DeepPartial<TeamReservation>,
    );
    reservation.arena = await this.arenaService.findOneOrFail({
      id: arenaId,
    });
    reservation.home = await this.teamService.findOneOrFail({
      id: homeId,
    });
    reservation.away = await this.teamService.findOneOrFail({
      id: awayId,
    });
    return this.teamReservationRepository.save(reservation);
  }

  async findAll(query: PaginateQuery): Promise<Paginated<TeamReservation>> {
    return await paginate<TeamReservation>(
      query,
      this.teamReservationRepository,
      teamReservationPaginationConfig,
    );
  }

  async findAllMe(
    userJwtPayload: JwtPayloadType,
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<TeamReservation>> {
    const queryBuilder = this.teamReservationRepository
      .createQueryBuilder('teamReservation')
      .leftJoinAndSelect('teamReservation.home', 'home')
      .leftJoinAndSelect('home.creator', 'creator')
      .leftJoinAndSelect('teamReservation.arena', 'arena')
      .where('creator.id = :id', { id: userJwtPayload.id });

    return await paginate<TeamReservation>(
      query,
      queryBuilder,
      teamReservationPaginationConfig,
    );
  }

  async findOne(
    field: FindOptionsWhere<TeamReservation>,
    relations?: FindOptionsRelations<TeamReservation>,
  ): Promise<NullableType<TeamReservation>> {
    return await this.teamReservationRepository.findOne({
      where: field,
      relations,
    });
  }

  async findOneOrFail(
    field: FindOptionsWhere<TeamReservation>,
    relations?: FindOptionsRelations<TeamReservation>,
  ): Promise<TeamReservation> {
    return await this.teamReservationRepository.findOneOrFail({
      where: field,
      relations,
    });
  }

  async update(
    id: string,
    updateTeamReservationDto: UpdateTeamReservationDto,
  ): Promise<TeamReservation> {
    const reservation = await this.findOneOrFail({ id });
    Object.assign(reservation, updateTeamReservationDto);
    return await this.teamReservationRepository.save(reservation);
  }

  async approveReservation(id: string): Promise<TeamReservation> {
    return await this.teamReservationRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        // Find the reservation to approve
        const reservation = await entityManager.findOneOrFail(TeamReservation, {
          where: { id },
          relations: ['user'],
        });

        // Find overlapping team reservations to be rejected
        const overlappingTeamReservations = await entityManager.find(
          TeamReservation,
          {
            where: [
              {
                day: reservation.day,
                startHour: LessThan(reservation.endHour),
                endHour: MoreThan(reservation.startHour),
                id: Not(reservation.id),
              },
            ],
            relations: ['home', 'away'],
          },
        );

        // Update the status of overlapping team reservations in a single query
        await entityManager
          .createQueryBuilder()
          .update(TeamReservation)
          .set({ status: ReservationTypeEnum.REJECTED })
          .where('day = :day', { day: reservation.day })
          .andWhere('(startHour < :endHour AND endHour > :startHour)', {
            startHour: reservation.startHour,
            endHour: reservation.endHour,
          })
          .andWhere('id != :id', { id: reservation.id })
          .execute();

        if (overlappingTeamReservations.length) {
          // Notify users of rejected reservations
          const rejectedUsers = overlappingTeamReservations.map((overlap) =>
            this.mapper.map(overlap.home.creator, User, UserDto),
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
        const mappedUser = this.mapper.map(
          reservation.home.creator,
          User,
          UserDto,
        );
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
    return await this.teamReservationRepository.delete(id);
  }
}
