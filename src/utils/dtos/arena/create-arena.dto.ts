import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';

export class CreateArenaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  arenaCategoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  length: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  width: number;

  @ApiProperty({
    description: 'Arena reservation unit quantity per hour',
    example: 1,
  })
  @AutoMap()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  unitQuantity: number;

  @ApiProperty({
    description: 'Arena reservation price per unit',
    example: 1,
  })
  @AutoMap()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  unitPrice: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  covered?: boolean;

  constructor({
    arenaCategoryId,
    name,
    length,
    width,
    unitQuantity,
    unitPrice,
    covered,
  }: {
    arenaCategoryId: string;
    name: string;
    length: number;
    width: number;
    unitQuantity: number;
    unitPrice: number;
    covered?: boolean;
  }) {
    this.arenaCategoryId = arenaCategoryId;
    this.name = name;
    this.length = length;
    this.width = width;
    this.unitQuantity = unitQuantity;
    this.unitPrice = unitPrice;
    this.covered = covered;
  }
}
