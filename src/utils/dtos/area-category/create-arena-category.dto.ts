import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArenaCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  constructor({ name }: { name: string }) {
    this.name = name;
  }
}
