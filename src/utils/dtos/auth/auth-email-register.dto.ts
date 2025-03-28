import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { lowerCaseTransformer } from '../../transformers/lower-case.transformer';
import { CreateAddressDto } from '@/domains/address/create-address.dto';
import { IsUniqueOrAppend } from '../../validators/is-unique-or-append';

export class AuthEmailRegisterDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @Validate(IsNotExist, ['User', 'validation.emailAlreadyExists'])
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'H@mza12345' })
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(16)
  @MinLength(2)
  @Validate(IsUniqueOrAppend, [
    'User',
    'userName',
    'validation.userNameAlreadyExists',
  ])
  userName: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @ApiProperty({ example: 'xe8emg58q2x27ohlfuz7n76u3btbzz4a' })
  @IsString()
  @IsOptional()
  notificationsToken?: string;
}
