import { AutoMap } from 'automapper-classes';
import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PlayerPositionEnum } from '@/enums/match-players/player-position.enum';
import EntityHelper from '../../utils/entities/entity-helper';
import { Match } from '../../match/entities/match.entity';
import { PlayerSideEnum } from '@/enums/match-players/player-side.enum';

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
  @Column({ default: PlayerPositionEnum.MF })
  position: PlayerPositionEnum;

  @AutoMap()
  @Column({ default: PlayerSideEnum.HOME })
  side: PlayerSideEnum;

  @AutoMap()
  @Column({ default: false })
  accepted: boolean;

  @AutoMap()
  @Column({ default: 0 })
  goals: number;
}
