import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AutoMap } from 'automapper-classes';
import { Arena } from '../../arena/entities/arena.entity';
import EntityHelper from '../../utils/entities/entity-helper';

@Entity()
export class Teammate extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => User)
  @ManyToOne(() => User, { eager: true })
  creator: User;

  @AutoMap(() => Arena)
  @ManyToOne(() => Arena, { eager: true })
  arena: Arena;

  @AutoMap()
  @Column({ type: 'timestamp' })
  matchDateTime: Date;

  @AutoMap()
  @Column({ type: 'int', default: 1 })
  requiredPlayers: number;

  @AutoMap()
  @Column({ nullable: true })
  preferences: string;

  @AutoMap()
  @Column({ type: 'boolean', default: false })
  isFilled: boolean;
}
