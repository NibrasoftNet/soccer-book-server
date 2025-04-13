import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Teammate } from '../../teammate/entities/teammate.entity';
import { TeammateParticipationStatusEnum } from '@/enums/teammate-paticipation/teammate-participation.enum';
import { User } from '../../users/entities/user.entity';

@Entity()
export class TeammateParticipation extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE',
  })
  creator: User;

  @AutoMap(() => Teammate)
  @ManyToOne(() => Teammate, (teammate) => teammate.participations, {
    onDelete: 'CASCADE',
  })
  teammate: Teammate;

  @AutoMap()
  @Column({ default: TeammateParticipationStatusEnum.PENDING })
  status: TeammateParticipationStatusEnum;
}
