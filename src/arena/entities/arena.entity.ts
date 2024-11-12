import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { UserAdmin } from '../../users-admin/entities/user-admin.entity';
import { Address } from '../../address/entities/address.entity';
import { FileEntity } from '../../files/entities/file.entity';
import { ArenaCategory } from '../../arena-category/entities/arena-category.entity';

@Entity()
export class Arena extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: String, nullable: false })
  name: string;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap(() => UserAdmin)
  @ManyToOne(() => UserAdmin, (userAdmin) => userAdmin.arenas, {
    onDelete: 'CASCADE',
  })
  userAdmin: UserAdmin;

  @AutoMap(() => ArenaCategory)
  @ManyToOne(() => ArenaCategory, (category) => category.arenas, {
    eager: true,
    nullable: false,
  })
  category: ArenaCategory;

  @AutoMap(() => Address)
  @OneToOne(() => Address, (address) => address.id, {
    eager: true,
  })
  @JoinColumn()
  address: Address;

  @AutoMap(() => [FileEntity])
  @ManyToMany(() => FileEntity, (file) => file.id, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  image?: FileEntity[] | null;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @AutoMap()
  @Column({ type: 'decimal', precision: 1, nullable: false, default: 1 })
  length: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 1, nullable: false, default: 1 })
  width: number;

  @AutoMap()
  @Column({ type: 'time', nullable: true, default: '10:00:00' })
  openTime: string;

  @AutoMap()
  @Column({ type: 'time', nullable: true, default: '23:59:59' })
  closeTime: string;
}
