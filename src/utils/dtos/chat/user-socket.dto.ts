import { AutoMap } from 'automapper-classes';
import { UserDto } from '@/domains/user/user.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';

export class UserSocketDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  user: UserDto;

  @AutoMap()
  socketId: string;
}
