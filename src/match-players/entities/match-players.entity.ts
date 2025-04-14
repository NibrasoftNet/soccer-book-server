import { AutoMap } from 'automapper-classes';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import {
  PlayerSideEnum,
  PlayerInvitationStatusEnum,
  PlayerMatchEnum,
} from '@/enums/match-players/player-match.enum';
import EntityHelper from '../../utils/entities/entity-helper';
import { Match } from '../../match/entities/match.entity';

@Entity()
export class MatchPlayer extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn()
  id: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, { eager: true })
  user: User;

  @AutoMap(() => Match)
  @ManyToOne(() => Match, (match) => match.players)
  match: Match;

  @AutoMap()
  @Column({ default: PlayerMatchEnum.MF })
  position: PlayerMatchEnum;

  @AutoMap()
  @Column({ default: PlayerSideEnum.HOME })
  side: PlayerSideEnum;

  @AutoMap()
  @Column({ default: PlayerInvitationStatusEnum.PENDING })
  accepted: PlayerInvitationStatusEnum;

  @AutoMap()
  @Column({ default: false })
  isOrganizer: boolean;

  @AutoMap()
  @Column({ default: 0 })
  goals: number;
}
