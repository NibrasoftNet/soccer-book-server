import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Validate,
} from 'class-validator';
import { lowerCaseTransformer } from '../../transformers/lower-case.transformer';
import { IsNotExist } from '../../validators/is-not-exists.validator';

export class CreateUserAdminDto {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User', 'email', 'validation.emailAlreadyExists'])
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  userName: string;

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

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  subscriptionExpiryDate: Date;

  constructor({
    email,
    userName,
    password,
    subscriptionExpiryDate,
  }: {
    email: string;
    userName: string;
    password?: string;
    notificationsToken?: string;
    subscriptionExpiryDate: Date;
  }) {
    this.email = email;
    this.userName = userName;
    this.password = password;
    this.subscriptionExpiryDate = subscriptionExpiryDate;
  }
}