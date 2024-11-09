import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Status } from '../../statuses/entities/status.entity';
import { FileEntity } from '../../files/entities/file.entity';
import bcrypt from 'bcryptjs';
import EntityHelper from '../../utils/entities/entity-helper';
import { Address } from '../../address/entities/address.entity';
import { AutoMap } from 'automapper-classes';
import { AuthProvidersEnum } from '@/enums/auth/auth-provider.enum';

@Entity()
export class User extends EntityHelper {
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
  firstName: string;

  @AutoMap(() => String)
  @Column({ type: String, nullable: false })
  lastName: string;

  @AutoMap(() => FileEntity)
  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

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

  @AutoMap(() => Address)
  @OneToOne(() => Address, (address) => address.id, {
    eager: true,
  })
  @JoinColumn()
  address: Address;

  @DeleteDateColumn()
  deletedAt: Date;

  @AutoMap()
  @Column({ type: String, nullable: true })
  notificationsToken?: string | null;

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
