import EntityHelper from '../../utils/entities/entity-helper';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Tournament } from '../../tournament/entities/tournament.entity';
import { Team } from '../../team/entities/team.entity';
import { ParticipationStatusEnum } from '@/enums/tournament-participation/participation-status.enum';
import { AutoMap } from 'automapper-classes';

@Entity()
export class TournamentParticipation extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => Tournament)
  @ManyToOne(() => Tournament, (tournament) => tournament.participations, {
    onDelete: 'CASCADE',
  })
  tournament: Tournament;

  @AutoMap(() => Team)
  @ManyToOne(() => Team, (team) => team.participations, { onDelete: 'CASCADE' })
  team: Team;

  @AutoMap()
  @Column({ default: ParticipationStatusEnum.PENDING })
  status: ParticipationStatusEnum;
}
