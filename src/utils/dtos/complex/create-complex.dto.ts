import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
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

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  referee?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  water?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  shower?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  towels?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  parking?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  room?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  recording?: boolean;

  constructor({
    name,
    description,
    address,
    openTime,
    closeTime,
    referee,
    water,
    shower,
    parking,
    room,
    recording,
  }: {
    name: string;
    description: string;
    address: CreateAddressDto;
    openTime: string;
    closeTime: string;
    referee?: boolean;
    water?: boolean;
    shower?: boolean;
    parking?: boolean;
    room?: boolean;
    recording?: boolean;
  }) {
    this.name = name;
    this.description = description;
    this.address = address;
    this.openTime = openTime;
    this.closeTime = closeTime;
    this.referee = referee;
    this.water = water;
    this.shower = shower;
    this.parking = parking;
    this.room = room;
    this.recording = recording;
  }
}
