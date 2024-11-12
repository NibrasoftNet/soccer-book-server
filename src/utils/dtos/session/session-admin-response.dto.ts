import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AutoMap } from 'automapper-classes';
import { UserAdminDto } from '@/domains/user-admin/user-admin.dto';

export class SessionAdminResponseDto {
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
  user: UserAdminDto;

  constructor({
    accessToken,
    refreshToken,
    tokenExpires,
    user,
  }: {
    accessToken: string;
    refreshToken: string;
    tokenExpires: number;
    user: UserAdminDto;
  }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpires = tokenExpires;
    this.user = user;
  }
}
