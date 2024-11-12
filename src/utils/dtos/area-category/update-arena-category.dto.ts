import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateArenaCategoryDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  constructor({ name }: { name?: string }) {
    this.name = name;
  }
}
