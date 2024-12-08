import { AutoMap } from 'automapper-classes';
import { UserDto } from '@/domains/user/user.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';

export class ChatDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap(() => UserDto)
  creator: UserDto;

  @AutoMap(() => [UserDto])
  participants: UserDto[];

  @AutoMap()
  isGroup: boolean;

  @AutoMap(() => UserDto)
  sender: UserDto;

  @AutoMap(() => UserDto)
  receiver: UserDto;
}
