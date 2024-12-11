import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { User } from '../../users/entities/user.entity';
import { Chat } from './chat.entity';
import { MessageTypeEnum } from '@/enums/chat/message-type.enum';

@Entity()
export class Message extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'CASCADE' })
  chat: Chat;

  @ManyToOne(() => User)
  sender: User;

  @Column({
    type: 'enum',
    enum: MessageTypeEnum,
    default: MessageTypeEnum.TEXT,
  })
  contentType: MessageTypeEnum;

  @Column('text', { array: true })
  content: string[];
}
