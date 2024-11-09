import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateTestimonialDto {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @AutoMap()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(5)
  rate: number;
}
