import { AutoMap } from 'automapper-classes';
import { WinnerEnum } from '@/enums/team-reservation/winner.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { MatchPlayer } from '../../match-players/entities/match-players.entity';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity()
export class Match extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => Reservation)
  @OneToOne(() => Reservation, (reservation) => reservation.id, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  reservation: Reservation;

  @AutoMap(() => [MatchPlayer])
  @OneToMany(() => MatchPlayer, (matchPlayer) => matchPlayer.match, {
    cascade: true,
    nullable: true,
  })
  players: MatchPlayer[];

  @AutoMap()
  @Column({ default: 0 })
  homeScore: number;

  @AutoMap()
  @Column({ default: 0 })
  awayScore: number;

  @AutoMap()
  @Column({ default: WinnerEnum.DRAW })
  winner: WinnerEnum;
}
