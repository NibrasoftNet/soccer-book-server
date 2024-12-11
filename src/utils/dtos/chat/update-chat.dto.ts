import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChatDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
