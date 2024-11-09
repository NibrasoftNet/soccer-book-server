import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AutoMap } from 'automapper-classes';
import { UserDto } from '@/domains/user/user.dto';

export class SessionResponseDto {
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @AutoMap()
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @AutoMap()
  @IsNumber()
  @IsNotEmpty()
  tokenExpires: number;

  @AutoMap()
  @IsNotEmpty()
  user: UserDto;

  constructor({
    accessToken,
    refreshToken,
    tokenExpires,
    user,
  }: {
    accessToken: string;
    refreshToken: string;
    tokenExpires: number;
    user: UserDto;
  }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpires = tokenExpires;
    this.user = user;
  }
}
