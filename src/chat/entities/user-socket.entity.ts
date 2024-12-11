import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';

@Entity()
export class UserSocket extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => User)
  @OneToOne(() => User, (user) => user.socket, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;

  @AutoMap()
  @Column({ type: 'varchar', length: 255, unique: true })
  socketId: string;
}
