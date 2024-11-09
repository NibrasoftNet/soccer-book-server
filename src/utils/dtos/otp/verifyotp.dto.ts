import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../transformers/lower-case.transformer';

export class ResendVerifyOtpDto {
  @ApiProperty({
    description: 'The email.',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(lowerCaseTransformer)
  email: string;
}
