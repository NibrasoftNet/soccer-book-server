import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { MatchPlayerDto } from '@/domains/match-players/match-players.dto';
import { Type } from 'class-transformer';

export class CreateMatchDto {
  @ApiProperty({ type: [MatchPlayerDto], required: false })
  @IsOptional()
  @Type(() => MatchPlayerDto)
  players?: MatchPlayerDto[];
}
