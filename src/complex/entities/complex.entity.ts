import EntityHelper from '../../utils/entities/entity-helper';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AutoMap } from 'automapper-classes';
import { UserAdmin } from '../../users-admin/entities/user-admin.entity';
import { Tournament } from '../../tournament/entities/tournament.entity';
import { Arena } from '../../arena/entities/arena.entity';
import { Address } from '../../address/entities/address.entity';
import { FileEntity } from '../../files/entities/file.entity';

@Entity()
export class Complex extends EntityHelper {
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
  @ManyToOne(() => UserAdmin, (userAdmin) => userAdmin.complexes, {
    onDelete: 'CASCADE',
  })
  creator: UserAdmin;

  @AutoMap(() => Address)
  @OneToOne(() => Address, (address) => address.id, {
    eager: true,
  })
  @JoinColumn()
  address: Address;

  @AutoMap(() => FileEntity)
  @ManyToOne(() => FileEntity, (file) => file.id, {
    eager: true,
    nullable: true,
  })
  @JoinTable()
  image?: FileEntity | null;

  @AutoMap()
  @Column({ type: 'time', nullable: true, default: '10:00' })
  openTime: string;

  @AutoMap()
  @Column({ type: 'time', nullable: true, default: '23:59' })
  closeTime: string;

  @AutoMap(() => [Arena])
  @OneToMany(() => Arena, (arena) => arena.complex)
  arenas: Arena[];

  @AutoMap(() => [Tournament])
  @OneToMany(() => Tournament, (tournament) => tournament.complex)
  tournaments: Tournament[];

  @AutoMap()
  @Column({ default: true })
  active: boolean;
}
