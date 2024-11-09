import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty()
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  street: string;

  constructor(
    country: string,
    city: string,
    longitude: number,
    latitude: number,
    street: string,
  ) {
    this.country = country;
    this.city = city;
    this.longitude = longitude;
    this.latitude = latitude;
    this.street = street;
  }
}
