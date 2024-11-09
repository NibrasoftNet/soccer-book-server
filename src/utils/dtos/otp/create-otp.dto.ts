import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOtpDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'The email of the Otp.', required: true })
  email: string;

  constructor(email: string) {
    this.email = email;
  }
}
