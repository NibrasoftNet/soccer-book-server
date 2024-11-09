import EntityHelper from '../../utils/entities/entity-helper';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from 'automapper-classes';
import { User } from '../../users/entities/user.entity';
import { NotificationTypeOfSendingEnum } from '@/enums/notification/notification-type-of-sending.enum';

@Entity()
export class Notification extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => String)
  @Column({ nullable: false, length: 64 })
  title: string;

  @AutoMap(() => String)
  @Column({ type: String, nullable: true })
  message: string | null;

  @AutoMap()
  @Column()
  forAllUsers: boolean;

  @AutoMap()
  @Column({
    enum: NotificationTypeOfSendingEnum,
    default: NotificationTypeOfSendingEnum.IMMEDIATELY,
  })
  typeOfSending: NotificationTypeOfSendingEnum;

  @AutoMap(() => Date)
  @Column({ type: Date, nullable: true })
  punctualSendDate: Date | null;

  @AutoMap(() => [Date])
  @Column({ type: Date, nullable: true, array: true })
  scheduledNotification: Date[] | null;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @AutoMap(() => [User])
  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  users: User[];

  @AutoMap(() => Boolean)
  @Column({ default: false })
  isNotificationSent: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  handleTypeOfSending() {
    if (this.typeOfSending !== NotificationTypeOfSendingEnum.PROGRAMMED) {
      this.scheduledNotification = null;
    }
    if (this.typeOfSending !== NotificationTypeOfSendingEnum.PUNCTUAL) {
      this.punctualSendDate = null;
    }
    if (this.typeOfSending === NotificationTypeOfSendingEnum.IMMEDIATELY) {
      this.scheduledNotification = null;
      this.punctualSendDate = null;
    }
  }
}
