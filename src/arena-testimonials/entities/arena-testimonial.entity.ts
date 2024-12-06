import { AutoMap } from 'automapper-classes';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import EntityHelper from '../../utils/entities/entity-helper';
import { Arena } from '../../arena/entities/arena.entity';

@Entity()
export class ArenaTestimonial extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  comment: string;

  @AutoMap()
  @Column()
  rate: number;

  @AutoMap(() => Arena)
  @ManyToOne(() => Arena, (arena) => arena.testimonials, {
    nullable: false,
  })
  arena: Arena;

  @AutoMap(() => User)
  @ManyToOne(() => User, {
    eager: true,
    nullable: false,
  })
  creator: User;
}
