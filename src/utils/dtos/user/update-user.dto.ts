import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, MinLength, Validate } from 'class-validator';
import { lowerCaseTransformer } from '../../transformers/lower-case.transformer';
import { IsNotExist } from '../../validators/is-not-exists.validator';
import { FileDto } from '@/domains/files/file.dto';
import { IsExist } from '../../validators/is-exists.validator';
import { RoleDto } from '@/domains/role/role.dto';
import { StatusesDto } from '@/domains/status/statuses.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'test1@example.com' })
  @Transform(lowerCaseTransformer)
  @IsOptional()
  @Validate(IsNotExist, ['User', 'validation.emailAlreadyExists'])
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(6)
  password?: string;

  provider?: string;

  socialId?: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({ type: () => FileDto })
  @IsOptional()
  @Validate(IsExist, ['FileEntity', 'id', 'validation.imageNotExists'])
  photo?: FileDto;

  @ApiProperty({ type: RoleDto })
  @IsOptional()
  @Validate(IsExist, ['Role', 'id', 'validation.roleNotExists'])
  role?: RoleDto;

  @ApiProperty({ type: StatusesDto })
  @IsOptional()
  @Validate(IsExist, ['Status', 'id', 'validation.statusNotExists'])
  status?: StatusesDto;

  hash?: string | null;
}
