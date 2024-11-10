import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { Team } from '../../team/entities/team.entity';
import { SubscriptionToTeamStatusEnum } from '@/enums/subscription-to-team/subscription-to-team-status.enum';

@Entity()
export class SubscriptionToTeam extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => Team)
  @ManyToOne(() => Team, (team) => team.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @AutoMap(() => User)
  @ManyToOne(() => User, (applicant) => applicant.joinedTeams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'member_id' })
  member: User;

  @AutoMap()
  @Column({ default: SubscriptionToTeamStatusEnum.ACCEPTED })
  status: SubscriptionToTeamStatusEnum;
}
