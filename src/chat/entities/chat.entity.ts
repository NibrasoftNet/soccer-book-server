import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Message } from './message.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { User } from '../../users/entities/user.entity';
import { AutoMap } from 'automapper-classes';

@Entity()
export class Chat extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: String, nullable: true })
  name?: string | null;

  @AutoMap(() => User)
  @ManyToOne(() => User, { nullable: true })
  creator?: User | null; // Only for group chats

  @AutoMap(() => [User])
  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  participants?: User[] | null;

  @AutoMap()
  @Column({ default: false })
  isGroup: boolean;

  @AutoMap(() => User)
  @ManyToOne(() => User, { nullable: true })
  sender?: User | null; // Only applicable for one-to-one chats

  @AutoMap(() => User)
  @ManyToOne(() => User, { nullable: true })
  receiver?: User | null;

  @AutoMap(() => [User])
  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @BeforeInsert()
  @BeforeUpdate()
  validateChatType() {
    if (this.isGroup) {
      // Clear one-to-one fields to ensure consistency
      this.sender = null;
      this.receiver = null;
    } else {
      // Clear group-specific fields to ensure consistency
      this.name = null;
      this.creator = null;
      this.participants = null;
    }
  }
}
