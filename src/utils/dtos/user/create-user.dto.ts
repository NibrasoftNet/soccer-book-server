import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
  ValidateNested,
} from 'class-validator';
import { lowerCaseTransformer } from '../../transformers/lower-case.transformer';
import { IsNotExist } from '../../validators/is-not-exists.validator';
import { RoleDto } from '@/domains/role/role.dto';
import { StatusesDto } from '@/domains/status/statuses.dto';
import { FileDto } from '@/domains/files/file.dto';
import { CreateAddressDto } from '@/domains/address/create-address.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User', 'email', 'validation.emailAlreadyExists'])
  @IsEmail()
  email: string;

  @ApiProperty({ type: RoleDto })
  @IsNotEmpty()
  @Type(() => RoleDto)
  @ValidateNested()
  role: RoleDto;

  @ApiProperty({ type: StatusesDto })
  @IsNotEmpty()
  @Type(() => StatusesDto)
  @ValidateNested()
  status: StatusesDto;

  @ApiProperty()
  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address?: CreateAddressDto;

  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  @Type(() => FileDto)
  @ValidateNested()
  photo?: FileDto | null;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'xe8emg58q2x27ohlfuz7n76u3btbzz4a' })
  @IsString()
  @IsOptional()
  notificationsToken?: string;

  constructor({
    email,
    role,
    status,
    address,
    photo,
    userName,
    password,
    provider,
    socialId,
  }: {
    email: string;
    role: RoleDto;
    status: StatusesDto;
    address?: CreateAddressDto;
    photo?: FileDto | null;
    userName: string;
    password?: string;
    provider?: string;
    socialId?: string | null;
  }) {
    this.email = email;
    this.role = role;
    this.status = status;
    this.address = address;
    this.photo = photo;
    this.userName = userName;
    this.password = password;
    this.provider = provider;
    this.socialId = socialId;
  }
}
