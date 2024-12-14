import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { ArenaDto } from '@/domains/arena/arena.dto';

export class ArenaTestimonialDto extends EntityHelperDto {
  @AutoMap()
  id: number;

  @AutoMap()
  comment: string;

  @AutoMap()
  rate: number;

  @AutoMap(() => ArenaDto)
  arena: ArenaDto;
}
