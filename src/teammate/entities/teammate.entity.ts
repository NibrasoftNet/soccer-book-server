import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { TeammateParticipation } from '../../teammate-participation/entities/teammate-participation.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity()
export class Teammate extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, { eager: true })
  creator: User;

  @AutoMap(() => Reservation)
  @ManyToOne(() => Reservation, { eager: true })
  reservation: Reservation;

  @AutoMap()
  @Column({ type: 'int', default: 1 })
  requiredPlayers: number;

  @AutoMap()
  @Column({ type: 'int', default: 0 })
  totalAccepted: number;

  @AutoMap()
  @Column({ nullable: true })
  preferences: string;

  @AutoMap()
  @Column({ type: 'boolean', default: false })
  isFilled: boolean;

  @AutoMap(() => [TeammateParticipation])
  @OneToMany(
    () => TeammateParticipation,
    (teammateParticipation) => teammateParticipation.teammate,
    { eager: true, nullable: true },
  )
  participations: TeammateParticipation[];

  @AutoMap()
  @Column({ default: true })
  active: boolean;
}
