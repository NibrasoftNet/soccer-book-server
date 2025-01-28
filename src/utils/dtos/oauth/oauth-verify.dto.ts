import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../transformers/lower-case.transformer';
import { AuthProvidersEnum } from '@/enums/auth/auth-provider.enum';

export class OauthVerifyDto {
  @ApiProperty({ description: 'The unique identifier for the social entry' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ description: 'The email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  @Transform(lowerCaseTransformer)
  email: string;

  @ApiProperty({ description: 'The auth provider' })
  @IsNotEmpty()
  @IsEnum(AuthProvidersEnum)
  provider: AuthProvidersEnum;
}
