import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTeammateDto } from '@/domains/teammate/create-teammate.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateTeammateDto extends PartialType(CreateTeammateDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  arenaId?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isFilled?: boolean;
}
