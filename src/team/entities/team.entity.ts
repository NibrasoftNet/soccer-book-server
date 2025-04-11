import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { User } from '../../users/entities/user.entity';
import { AutoMap } from 'automapper-classes';
import { FileEntity } from '../../files/entities/file.entity';
import { SubscriptionToTeam } from '../../subscription-to-team/entities/subscription-to-team.entity';
import { TournamentParticipation } from '../../tournament-participation/entities/tournament-participation.entity';
import { TeamReservation } from '../../team-reservation/entities/team-reservation.entity';

@Entity()
export class Team extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ unique: true, nullable: false })
  name: string;

  @AutoMap()
  @Column()
  bio: string;

  @AutoMap()
  @Column({ default: 1 })
  totalMembers: number;

  @AutoMap(() => FileEntity)
  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  logo?: FileEntity | null;

  @AutoMap(() => User)
  @ManyToOne(() => User, (user) => user.teams, { onDelete: 'CASCADE' })
  creator: User;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @AutoMap(() => [SubscriptionToTeam])
  @OneToMany(
    () => SubscriptionToTeam,
    (subscriptionToTeam) => subscriptionToTeam.team,
    {
      nullable: true,
      onDelete: 'SET NULL',
    },
  )
  members: SubscriptionToTeam[];

  @AutoMap(() => [TournamentParticipation])
  @OneToMany(
    () => TournamentParticipation,
    (participation) => participation.team,
  )
  participations: TournamentParticipation[];

  @AutoMap(() => [TeamReservation])
  @OneToMany(() => TeamReservation, (reservation) => reservation.home)
  homeReservation: TeamReservation[];

  @AutoMap(() => [TeamReservation])
  @OneToMany(() => TeamReservation, (reservation) => reservation.away)
  awayReservation: TeamReservation[];

  @AutoMap()
  @Column({ default: 0 })
  winCount: number;

  @AutoMap()
  @Column({ default: 0 })
  lossCount: number;
}
