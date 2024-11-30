import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../transformers/lower-case.transformer';
import { IsExist } from '../../validators/is-exists.validator';

export class AuthAdminForgotPasswordDto {
  @ApiProperty()
  @Transform(lowerCaseTransformer)
  @IsEmail()
  @Validate(IsExist, ['UserAdmin', 'email', 'validation.emailNotExists'])
  email: string;
}
