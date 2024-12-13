import { MessageTypeEnum } from '@/enums/chat/message-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ChatDto } from '@/domains/chat/chat.dto';
import { UserDto } from '@/domains/user/user.dto';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateChatMessageDto {
  @ApiProperty()
  @IsNotEmpty()
  chat: ChatDto;

  @ApiProperty()
  @IsNotEmpty()
  sender: UserDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isSenderAdmin: boolean;

  @ApiProperty()
  @IsArray()
  content: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(MessageTypeEnum)
  contentType: MessageTypeEnum;
}
