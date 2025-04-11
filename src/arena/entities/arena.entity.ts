import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { AutoMap } from 'automapper-classes';
import EntityHelper from '../../utils/entities/entity-helper';
import { FileEntity } from '../../files/entities/file.entity';
import { ArenaCategory } from '../../arena-category/entities/arena-category.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';
import { Complex } from '../../complex/entities/complex.entity';
import { ArenaTestimonial } from '../../arena-testimonials/entities/arena-testimonial.entity';
import { TeamReservation } from '../../team-reservation/entities/team-reservation.entity';

@Entity()
export class Arena extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ default: 'rades' })
  name: string;

  @AutoMap(() => Complex)
  @ManyToOne(() => Complex, (complex) => complex.arenas, {
    onDelete: 'CASCADE',
  })
  complex: Complex;

  @AutoMap(() => ArenaCategory)
  @ManyToOne(() => ArenaCategory, (category) => category.arenas, {
    eager: true,
    nullable: false,
  })
  category: ArenaCategory;

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
  @Column({ default: false })
  covered: boolean;

  @AutoMap()
  @Column({ type: 'decimal', precision: 3, nullable: false, default: 1 })
  length: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 3, nullable: false, default: 1 })
  width: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 2, nullable: false, default: 1 })
  unitQuantity: number;

  @AutoMap()
  @Column({ type: 'decimal', precision: 2, nullable: false, default: 10 })
  unitPrice: number;

  @AutoMap(() => [Reservation])
  @OneToMany(() => Reservation, (reservation) => reservation.arena, {
    nullable: true,
    eager: true,
  })
  reservations: Reservation[];

  @AutoMap(() => [TeamReservation])
  @OneToMany(
    () => TeamReservation,
    (teamReservation) => teamReservation.arena,
    {
      nullable: true,
      eager: true,
    },
  )
  teamReservations: TeamReservation[];

  @AutoMap(() => [ArenaTestimonial])
  @OneToMany(() => ArenaTestimonial, (testimonial) => testimonial.arena, {
    nullable: true,
    eager: true,
  })
  testimonials: ArenaTestimonial[];
}
