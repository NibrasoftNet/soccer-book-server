import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from '@/domains/address/create-address.dto';

export class AuthUpdateDto {
  @ApiProperty({ example: 'John' })
  @IsOptional()
  userName?: string | null;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address?: CreateAddressDto | null;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  notificationsToken?: string | null;

  constructor({
    userName,
    address,
    phone,
    email,
    password,
    notificationsToken,
  }: {
    userName?: string;
    address?: CreateAddressDto;
    phone?: string;
    email?: string;
    password?: string;
    notificationsToken?: string;
  }) {
    this.userName = userName;
    this.address = address;
    this.phone = phone;
    this.email = email;
    this.password = password;
    this.notificationsToken = notificationsToken;
  }
}
