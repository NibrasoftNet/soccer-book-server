import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';

export class UpdateArenaDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  arenaCategoryId?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  length?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(1)
  width?: number;

  @ApiProperty({
    description: 'Arena reservation unit quantity per hour',
    example: 1,
  })
  @AutoMap()
  @IsOptional()
  @IsNumber()
  @Min(1)
  unitQuantity?: number;

  @ApiProperty({
    description: 'Arena reservation price per unit',
    example: 1,
  })
  @AutoMap()
  @IsOptional()
  @IsNumber()
  @Min(1)
  unitPrice?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  covered?: boolean;

  constructor({
    arenaCategoryId,
    length,
    width,
    unitQuantity,
    unitPrice,
    covered,
  }: {
    arenaCategoryId?: string;
    length?: number;
    width?: number;
    unitQuantity?: number;
    unitPrice?: number;
    covered?: boolean;
  }) {
    this.arenaCategoryId = arenaCategoryId;
    this.length = length;
    this.width = width;
    this.unitQuantity = unitQuantity;
    this.unitPrice = unitPrice;
    this.covered = covered;
  }
}
