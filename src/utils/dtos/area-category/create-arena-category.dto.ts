import { IsHexColor, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArenaCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsHexColor()
  hexColor: string;

  constructor({ name, hexColor }: { name: string; hexColor: string }) {
    this.name = name;
    this.hexColor = hexColor;
  }
}
