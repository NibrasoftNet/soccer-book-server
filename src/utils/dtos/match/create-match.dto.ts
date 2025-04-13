import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { MatchPlayerDto } from '@/domains/match-players/match-players.dto';

export class CreateMatchDto {
  @ApiProperty()
  @IsOptional()
  players?: [MatchPlayerDto];
}
