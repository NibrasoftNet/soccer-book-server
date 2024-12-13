import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
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
  @IsNotEmpty()
  @IsBoolean()
  isSenderAdmin: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  receiverId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isReceiverAdmin: boolean;

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
    isSenderAdmin,
    receiverId,
    isReceiverAdmin,
    content,
    contentType,
  }: {
    chatId?: string;
    senderId: string;
    isSenderAdmin: boolean;
    receiverId: string;
    isReceiverAdmin: boolean;
    content: string[];
    contentType: MessageTypeEnum;
  }) {
    this.chatId = chatId;
    this.senderId = senderId;
    this.isSenderAdmin = isSenderAdmin;
    this.receiverId = receiverId;
    this.isReceiverAdmin = isReceiverAdmin;
    this.content = content;
    this.contentType = contentType;
  }
}
