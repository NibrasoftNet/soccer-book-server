import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MessageTypeEnum } from '@/enums/chat/message-type.enum';

export class CreateChatDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  chatId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  receiverId: string;

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
    receiverId,
    content,
    contentType,
  }: {
    chatId?: string;
    senderId: string;
    receiverId: string;
    content: string[];
    contentType: MessageTypeEnum;
  }) {
    this.chatId = chatId;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.contentType = contentType;
  }
}
