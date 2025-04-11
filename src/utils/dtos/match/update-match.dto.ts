import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMatchDto } from './create-match.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { WinnerEnum } from '@/enums/team-reservation/winner.enum';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  homeScore?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  awayScore?: number;

  @ApiProperty()
  @IsOptional()
  @IsEnum(WinnerEnum)
  winner?: WinnerEnum;
}
