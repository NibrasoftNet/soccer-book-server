import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { lowerCaseTransformer } from '../../transformers/lower-case.transformer';
import { CreateAddressDto } from '@/domains/address/create-address.dto';
import { AuthProvidersEnum } from '@/enums/auth/auth-provider.enum';

export class OauthRegisterDto {
  @ApiProperty({ description: 'The unique identifier for the social entry' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  @Transform(lowerCaseTransformer)
  email: string;

  @ApiProperty({ description: 'The picture URL of the user', required: false })
  @IsString()
  photo: string | null;

  @ApiProperty({ description: 'The first name of the user', required: false })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({ description: 'Address', required: false })
  @IsOptional()
  @Type(() => CreateAddressDto)
  @ValidateNested()
  address?: CreateAddressDto;

  @ApiProperty({ description: 'The last name of the user', required: false })
  @IsOptional()
  @IsString()
  notificationToken?: string;

  @ApiProperty({ description: 'The auth provider' })
  @IsNotEmpty()
  @IsEnum(AuthProvidersEnum)
  provider: AuthProvidersEnum;
}
