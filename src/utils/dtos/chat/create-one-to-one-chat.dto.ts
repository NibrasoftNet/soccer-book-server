import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateOneToOneChatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isSenderAdmin: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  receiverId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isReceiverAdmin: boolean;
}
