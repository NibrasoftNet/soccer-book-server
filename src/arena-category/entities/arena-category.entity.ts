import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import EntityHelper from '../../utils/entities/entity-helper';
import { FileEntity } from '../../files/entities/file.entity';
import { AutoMap } from 'automapper-classes';
import { Arena } from '../../arena/entities/arena.entity';

@Entity()
export class ArenaCategory extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column({ type: 'varchar', length: 7, default: '#5bb450' })
  hexColor: string;

  @AutoMap(() => FileEntity)
  @OneToOne(() => FileEntity, (file) => file.id, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  image?: FileEntity;

  @AutoMap(() => [Arena])
  @OneToMany(() => Arena, (arena) => arena.category, {
    nullable: true,
  })
  arenas?: Arena[];
}
