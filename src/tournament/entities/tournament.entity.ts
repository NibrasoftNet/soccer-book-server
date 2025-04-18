import EntityHelper from '../../utils/entities/entity-helper';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Arena } from '../../arena/entities/arena.entity';
import { TournamentParticipation } from '../../tournament-participation/entities/tournament-participation.entity';
import { AutoMap } from 'automapper-classes';
import { FileEntity } from '../../files/entities/file.entity';
import { Complex } from '../../complex/entities/complex.entity';
import { TournamentTypeEnum } from '@/enums/tournament/tournament-type.enum';

@Entity()
export class Tournament extends EntityHelper {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  name: string;

  @AutoMap()
  @Column()
  description: string;

  @AutoMap(() => FileEntity)
  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  image?: FileEntity | null;

  @AutoMap()
  @Column({ type: 'timestamp' })
  startDate: Date;

  @AutoMap()
  @Column({ type: 'timestamp' })
  finishDate: Date;

  @AutoMap()
  @Column({ type: 'timestamp' })
  lastSubscriptionDate: Date;

  @AutoMap()
  @Column({ type: 'int', width: 2, default: 2 })
  numberOfTeams: number;

  @AutoMap()
  @Column({ type: 'int', width: 2, default: 0 })
  totalJoinedTeams: number;

  @AutoMap()
  @Column({ default: TournamentTypeEnum.CUP })
  type: TournamentTypeEnum;

  @AutoMap()
  @Column({ default: true })
  active: boolean;

  @AutoMap(() => Complex)
  @ManyToOne(() => Complex, (complex) => complex.tournaments, {
    eager: true,
    onDelete: 'CASCADE',
  })
  complex: Complex;

  @AutoMap(() => Arena)
  @OneToMany(
    () => TournamentParticipation,
    (participation) => participation.tournament,
  )
  participations: TournamentParticipation[];

  @AutoMap()
  @Column({ type: 'decimal', precision: 2, nullable: false, default: 10 })
  price: number;
}
