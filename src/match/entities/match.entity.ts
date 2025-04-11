import { AutoMap } from 'automapper-classes';
import { WinnerEnum } from '@/enums/team-reservation/winner.enum';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TeamReservation } from '../../team-reservation/entities/team-reservation.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { MatchPlayer } from '../../match-players/entities/match-players.entity';

@Entity()
export class Match extends EntityHelperDto {
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

  @AutoMap(() => TeamReservation)
  @OneToOne(() => TeamReservation, (teamReservation) => teamReservation.id, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  teamReservation: TeamReservation;

  @AutoMap(() => [MatchPlayer])
  @OneToMany(() => MatchPlayer, (matchPlayer) => matchPlayer.match, {
    cascade: true,
    nullable: true,
  })
  players: MatchPlayer[];

  @AutoMap()
  @Column()
  homeScore: number;

  @AutoMap()
  @Column()
  awayScore: number;

  @AutoMap()
  @Column()
  winner: WinnerEnum;
}
