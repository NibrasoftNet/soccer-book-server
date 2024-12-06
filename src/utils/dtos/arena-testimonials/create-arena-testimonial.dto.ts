import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArenaTestimonialDto {
  @ApiProperty()
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty()
  @AutoMap()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  rate: number;
}
