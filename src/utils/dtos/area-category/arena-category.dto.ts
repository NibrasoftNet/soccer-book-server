import { AutoMap } from 'automapper-classes';
import { FileDto } from '@/domains/files/file.dto';
import { ArenaDto } from '@/domains/arena/arena.dto';

export class ArenaCategoryDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap(() => FileDto)
  image: FileDto;

  @AutoMap(() => [ArenaDto])
  fields: ArenaDto[];
}
