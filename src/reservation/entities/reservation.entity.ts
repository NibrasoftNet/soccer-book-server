import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Arena } from '../../arena/entities/arena.entity';
import {
  ReservationCreatorEnum,
  ReservationTypeEnum,
} from '@/enums/reservation/reservation-type.enum';
import { Team } from '../../team/entities/team.entity';

@Entity()
export class Reservation extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.reservations, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @AutoMap(() => Team)
  @ManyToOne(() => Team, { nullable: true, onDelete: 'CASCADE' })
  home: Team;

  @AutoMap(() => Team)
  @ManyToOne(() => Team, { nullable: true, onDelete: 'CASCADE' })
  away: Team;

  @AutoMap(() => Arena)
  @ManyToOne(() => Arena, (arena) => arena.reservations, {
    onDelete: 'CASCADE',
  })
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

  @AutoMap()
  @Column({
    type: 'enum',
    enum: ReservationCreatorEnum,
    default: ReservationCreatorEnum.SINGLE,
  })
  type: ReservationCreatorEnum;
}
