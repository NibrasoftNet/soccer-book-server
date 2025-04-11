import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { MatchPlayerDto } from '@/domains/match-players/match-players.dto';

export class CreateMatchDto {
  @ApiProperty()
  @ValidateIf((dto) => !dto.teamReservationId)
  @IsNotEmpty()
  @IsString()
  reservationId?: string;

  @ApiProperty()
  @ValidateIf((dto) => !dto.reservationId)
  @IsNotEmpty()
  @IsString()
  teamReservationId?: string;

  @ApiProperty()
  @IsOptional()
  players?: [MatchPlayerDto];
}
