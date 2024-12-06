import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { UserAdmin } from '../../users-admin/entities/user-admin.entity';
import { Address } from '../../address/entities/address.entity';
import { FileEntity } from '../../files/entities/file.entity';
import { ArenaCategory } from '../../arena-category/entities/arena-category.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Tournament } from '../../tournament/entities/tournament.entity';
import { ArenaTestimonial } from '../../arena-testimonials/entities/arena-testimonial.entity';

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
  creator: UserAdmin;

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
  @Column({ type: 'decimal', precision: 3, nullable: false, default: 1 })
  length: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 3, nullable: false, default: 1 })
  width: number;

  @AutoMap()
  @Column({ type: 'time', nullable: true, default: '10:00' })
  openTime: string;

  @AutoMap()
  @Column({ type: 'time', nullable: true, default: '23:59' })
  closeTime: string;

  @AutoMap(() => [Reservation])
  @OneToMany(() => Reservation, (reservation) => reservation.arena, {
    nullable: true,
    eager: true,
  })
  reservations: Reservation[];

  @AutoMap(() => [Tournament])
  @OneToMany(() => Tournament, (tournament) => tournament.arena)
  tournaments: Tournament[];

  @AutoMap(() => [ArenaTestimonial])
  @OneToMany(() => ArenaTestimonial, (testimonial) => testimonial.arena, {
    nullable: true,
    eager: true,
  })
  testimonials: ArenaTestimonial[];
}
