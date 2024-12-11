import { PartialType } from '@nestjs/mapped-types';
import { CreateChatMessageDto } from '@/domains/chat/create-chat-message.dto';

export class UpdateChatMessageDto extends PartialType(CreateChatMessageDto) {
  id: number;
}
