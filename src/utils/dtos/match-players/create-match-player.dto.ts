import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  PlayerMatchEnum,
  PlayerSideEnum,
} from '@/enums/match-players/player-match.enum';

export class CreateMatchPlayerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: PlayerMatchEnum.MF })
  @IsNotEmpty()
  @IsEnum(PlayerMatchEnum)
  position: PlayerMatchEnum;

  @ApiProperty({ example: PlayerSideEnum.HOME })
  @IsNotEmpty()
  @IsEnum(PlayerSideEnum)
  side: PlayerSideEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isOrganizer: boolean;
}
