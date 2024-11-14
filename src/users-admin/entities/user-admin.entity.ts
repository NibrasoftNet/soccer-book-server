import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import bcrypt from 'bcryptjs';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';
import { AuthProvidersEnum } from '@/enums/auth/auth-provider.enum';
import { FileEntity } from '../../files/entities/file.entity';
import { Arena } from '../../arena/entities/arena.entity';

@Entity()
export class UserAdmin extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: String, unique: true, nullable: false })
  email: string;

  @Column({ nullable: true, type: String })
  password: string;

  public previousPassword: string;

  @AutoMap()
  @Column({ default: AuthProvidersEnum.EMAIL })
  provider: string;

  @AutoMap(() => String)
  @Index()
  @Column({ type: String, nullable: true })
  socialId?: string | null;

  @AutoMap(() => String)
  @Column({ type: String, nullable: false })
  userName: string;

  @AutoMap(() => Role)
  @ManyToOne(() => Role, {
    eager: true,
  })
  role: Role;

  @AutoMap(() => Status)
  @ManyToOne(() => Status, {
    eager: true,
  })
  status: Status;

  @AutoMap(() => FileEntity)
  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @DeleteDateColumn()
  deletedAt: Date;

  @AutoMap()
  @Column({ type: String, nullable: true })
  notificationsToken?: string | null;

  @AutoMap()
  @Column({ type: 'timestamp', nullable: false })
  subscriptionExpiryDate: Date;

  @AutoMap(() => [Arena])
  @OneToMany(() => Arena, (arena) => arena.creator, {
    cascade: true,
  })
  arenas: Arena[];

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword() {
    if (this.previousPassword !== this.password && this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
