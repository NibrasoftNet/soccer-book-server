import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTeamDto {
  @ApiProperty({ example: 'My team' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: '#free palestine' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  constructor({
    name,
    bio,
    active,
  }: {
    name?: string | undefined;
    bio?: string | undefined;
    active?: boolean | undefined;
  }) {
    this.name = name;
    this.bio = bio;
    this.active = active;
  }
}
