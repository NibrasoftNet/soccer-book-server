import { AutoMap } from 'automapper-classes';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { UserDto } from '@/domains/user/user.dto';

export class ArenaTestimonialDto extends EntityHelperDto {
  @AutoMap()
  id: number;

  @AutoMap()
  comment: string;

  @AutoMap()
  rate: number;

  @AutoMap(() => UserDto)
  user: UserDto;
}
