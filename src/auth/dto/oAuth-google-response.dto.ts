import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class NameDto {
  @ApiProperty({ example: 'Solutions' })
  @IsString()
  @IsNotEmpty()
  familyName: string;

  @ApiProperty({ example: 'Weavers' })
  @IsString()
  @IsNotEmpty()
  givenName: string;
}

class EmailDto {
  @ApiProperty({ example: 'weavers.top@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  value: string;

  @ApiProperty({ example: true })
  @IsOptional()
  verified?: boolean;
}

class PhotoDto {
  @ApiProperty({
    example:
      'https://lh3.googleusercontent.com/a/ACg8ocLAOuVyL8vgZSN6xZaXFrgCT4WZKUA0td1Fxlh-wvZPnflMs5_H=s96-c',
  })
  @IsString()
  value: string | null;
}

export class OAuthGoogleResponseDto {
  @ApiProperty({ example: '111731826143086840578' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Weavers Solutions' })
  @IsString()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty({ type: NameDto })
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ApiProperty({ type: [EmailDto] })
  @ValidateNested({ each: true })
  @Type(() => EmailDto)
  emails: EmailDto[];

  @ApiProperty({ type: [PhotoDto] })
  @ValidateNested({ each: true })
  @Type(() => PhotoDto)
  photos: PhotoDto[] | null;

  @ApiProperty({ example: 'google' })
  @IsString()
  @IsNotEmpty()
  provider: string;
}
