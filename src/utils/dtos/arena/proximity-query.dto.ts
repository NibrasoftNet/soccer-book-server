import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ProximityQueryDto {
  @ApiProperty({ example: 10.084724267526699 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsNumber()
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: 36.823050325571295 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @IsNumber()
  @IsLongitude()
  longitude: number;

  @ApiProperty({ example: 1000 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1000)
  distance: number;
}
