import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '@/domains/address/create-address.dto';

export class UpdateComplexDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address?: CreateAddressDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'openTime must be in the format HH:mm',
  })
  openTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'openTime must be in the format HH:mm',
  })
  closeTime?: string;

  constructor({
    name,
    description,
    address,
    openTime,
    closeTime,
  }: {
    name?: string;
    description?: string;
    address?: CreateAddressDto;
    openTime?: string;
    closeTime?: string;
  }) {
    this.name = name;
    this.description = description;
    this.address = address;
    this.openTime = openTime;
    this.closeTime = closeTime;
  }
}
