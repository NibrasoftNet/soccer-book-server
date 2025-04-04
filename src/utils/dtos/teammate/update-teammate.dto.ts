import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTeammateDto } from '@/domains/teammate/create-teammate.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTeammateDto extends PartialType(CreateTeammateDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  reservationId?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isFilled?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  totalAccepted?: number;
}
