import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '@/domains/address/create-address.dto';

export class CreateArenaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  arenaCategoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address: CreateAddressDto;

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

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'openTime must be in the format HH:mm',
  })
  openTime: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'openTime must be in the format HH:mm',
  })
  closeTime: string;

  constructor({
    name,
    description,
    arenaCategoryId,
    address,
    length,
    width,
    openTime,
    closeTime,
  }: {
    name: string;
    description: string;
    arenaCategoryId: string;
    address: CreateAddressDto;
    length: number;
    width: number;
    openTime: string;
    closeTime: string;
  }) {
    this.name = name;
    this.description = description;
    this.address = address;
    this.length = length;
    this.width = width;
    this.openTime = openTime;
    this.closeTime = closeTime;
    this.arenaCategoryId = arenaCategoryId;
  }
}
