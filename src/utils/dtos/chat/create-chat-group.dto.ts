import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageTypeEnum } from '@/enums/chat/message-type.enum';

export class CreateChatGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  chatId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(MessageTypeEnum)
  contentType: MessageTypeEnum;

  constructor({
    chatId,
    senderId,
    content,
    contentType,
  }: {
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string[];
    contentType: MessageTypeEnum;
  }) {
    this.chatId = chatId;
    this.senderId = senderId;
    this.content = content;
    this.contentType = contentType;
  }
}
