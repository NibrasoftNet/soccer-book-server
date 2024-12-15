import { AutoMap } from 'automapper-classes';
import { UserDto } from '@/domains/user/user.dto';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { Expose } from 'class-transformer';

export class ChatDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  name: string;

  @AutoMap(() => UserDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  creator: UserDto;

  @AutoMap(() => [UserDto])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  participants: UserDto[];

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  isGroup: boolean;

  @AutoMap(() => UserDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  sender: UserDto;

  @AutoMap(() => UserDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  receiver: UserDto;
}
