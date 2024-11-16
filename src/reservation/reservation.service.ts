import { Injectable } from '@nestjs/common';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { Reservation } from './entities/reservation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
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

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly usersService: UsersService,
    private readonly arenaService: ArenaService,
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

        // Approve the current reservation
        reservation.status = ReservationTypeEnum.CONFIRMED;
        return await entityManager.save(Reservation, reservation);
      },
    );
  }

  async remove(id: string) {
    return await this.reservationRepository.delete(id);
  }
}
