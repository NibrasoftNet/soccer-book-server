import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Arena } from '../../arena/entities/arena.entity';
import { ReservationTypeEnum } from '@/enums/reservation/reservation-type.enum';

@Entity()
export class Reservation extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @AutoMap(() => Arena)
  @ManyToOne(() => Arena, (arena) => arena.reservations)
  arena: Arena;

  @AutoMap()
  @Column({ type: 'timestamp' })
  day: Date;

  @AutoMap()
  @Column({ type: 'time' })
  startHour: string;

  @AutoMap()
  @Column({ type: 'time' })
  endHour: string;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: ReservationTypeEnum,
    default: ReservationTypeEnum.PENDING,
  })
  status: ReservationTypeEnum;
}
