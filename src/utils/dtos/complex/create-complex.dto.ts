import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '@/domains/address/create-address.dto';

export class CreateComplexDto {
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
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address: CreateAddressDto;

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
    address,
    openTime,
    closeTime,
  }: {
    name: string;
    description: string;
    address: CreateAddressDto;
    openTime: string;
    closeTime: string;
  }) {
    this.name = name;
    this.description = description;
    this.address = address;
    this.openTime = openTime;
    this.closeTime = closeTime;
  }
}
