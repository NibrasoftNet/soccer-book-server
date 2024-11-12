import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserAdminDto } from './create-user-admin.dto';

import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { FileDto } from '@/domains/files/file.dto';
import { RoleDto } from '@/domains/role/role.dto';
import { StatusesDto } from '@/domains/status/statuses.dto';

export class UpdateUserAdminDto extends PartialType(CreateUserAdminDto) {
  @ApiProperty({ type: RoleDto })
  @IsOptional()
  @Type(() => RoleDto)
  @ValidateNested()
  role?: RoleDto;

  @ApiProperty({ type: StatusesDto })
  @IsOptional()
  @Type(() => StatusesDto)
  @ValidateNested()
  status?: StatusesDto;

  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  @Type(() => FileDto)
  @ValidateNested()
  photo?: FileDto | null;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty()
  @IsOptional()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  password?: string;

  provider?: string;

  socialId?: string | null;

  @ApiProperty({ example: 'xe8emg58q2x27ohlfuz7n76u3btbzz4a' })
  @IsString()
  @IsOptional()
  notificationsToken?: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  subscriptionExpiryDate?: Date;
}
