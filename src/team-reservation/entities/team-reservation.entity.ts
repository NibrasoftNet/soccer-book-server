import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Arena } from '../../arena/entities/arena.entity';
import { ReservationTypeEnum } from '@/enums/reservation/reservation-type.enum';
import { Team } from '../../team/entities/team.entity';

@Entity()
export class TeamReservation extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => Arena)
  @ManyToOne(() => Arena, (arena) => arena.teamReservations)
  arena: Arena;

  @AutoMap(() => Team)
  @ManyToOne(() => Team, (team) => team.homeReservation)
  home: Team;

  @AutoMap(() => Team)
  @ManyToOne(() => Team, (team) => team.awayReservation)
  away: Team;

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
