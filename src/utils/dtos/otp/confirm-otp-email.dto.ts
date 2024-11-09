import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../transformers/lower-case.transformer';

export class ConfirmOtpEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @Transform(lowerCaseTransformer)
  @ApiProperty({ description: 'The email of the Otp.', required: true })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'The confirmation otp of the SMS.',
    required: true,
  })
  otp: string;
}
