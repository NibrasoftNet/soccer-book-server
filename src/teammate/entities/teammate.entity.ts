import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { Complex } from '../../complex/entities/complex.entity';
import { TeammateParticipation } from '../../teammate-participation/entities/teammate-participation.entity';

@Entity()
export class Teammate extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, { eager: true })
  creator: User;

  @AutoMap(() => Complex)
  @ManyToOne(() => Complex, { eager: true })
  complex: Complex;

  @AutoMap()
  @Column({ type: 'timestamp' })
  matchDateTime: Date;

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
  @ManyToOne(
    () => TeammateParticipation,
    (teammateParticipation) => teammateParticipation.teammate,
  )
  participations: TeammateParticipation;

  @AutoMap()
  @Column({ default: true })
  active: boolean;
}
