import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../transformers/lower-case.transformer';

export class SocialRegisterDto {
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
  firstName?: string;

  @ApiProperty({ description: 'The last name of the user', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  constructor({
    id,
    email,
    photo,
    firstName,
    lastName,
  }: {
    id: string;
    email: string;
    photo: string | null;
    firstName?: string;
    lastName?: string;
  }) {
    this.id = id;
    this.email = email;
    this.photo = photo;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
