import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeammateDto {
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  requiredPlayers: number;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  @IsString()
  preferences: string;
}
