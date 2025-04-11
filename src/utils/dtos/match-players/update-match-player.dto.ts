import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateMatchPlayerDto } from '@/domains/match-players/create-match-player.dto';

export class UpdateMatchPlayerDto extends PartialType(CreateMatchPlayerDto) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  accepted?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  goals?: number;
}
