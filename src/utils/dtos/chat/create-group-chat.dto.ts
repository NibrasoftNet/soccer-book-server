import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupChatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
