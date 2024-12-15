import { MessageTypeEnum } from '@/enums/chat/message-type.enum';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { AutoMap } from 'automapper-classes';
import { ChatDto } from '@/domains/chat/chat.dto';
import { UserDto } from '@/domains/user/user.dto';
import { Expose } from 'class-transformer';

export class MessageDto extends EntityHelperDto {
  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  id: string;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  chat: ChatDto;

  @AutoMap(() => UserDto)
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  sender: Record<string, any>;

  @AutoMap()
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  contentType: MessageTypeEnum;

  @AutoMap(() => [String])
  @Expose({ groups: ['ADMIN', 'USER', 'SUPERADMIN'] })
  content: string[];
}
