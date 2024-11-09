import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { AutoMap } from 'automapper-classes';

@Entity()
export class Address extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ nullable: false })
  country: string;

  @AutoMap()
  @Column()
  city: string;

  @AutoMap()
  @Column({ type: 'double precision', nullable: false })
  longitude: number;

  @AutoMap()
  @Column({ type: 'double precision', nullable: false })
  latitude: number;

  @AutoMap()
  @Column()
  street: string;
}
