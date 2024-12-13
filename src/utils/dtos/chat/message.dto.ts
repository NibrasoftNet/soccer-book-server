import { MessageTypeEnum } from '@/enums/chat/message-type.enum';
import { EntityHelperDto } from '@/domains/general/entity-helper.dto';
import { AutoMap } from 'automapper-classes';
import { ChatDto } from '@/domains/chat/chat.dto';
import { UserDto } from '@/domains/user/user.dto';

export class MessageDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap()
  chat: ChatDto;

  @AutoMap(() => UserDto)
  sender: Record<string, any>;

  @AutoMap()
  contentType: MessageTypeEnum;

  @AutoMap(() => [String])
  content: string[];
}
