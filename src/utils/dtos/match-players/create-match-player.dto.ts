import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PlayerSideEnum } from '@/enums/match-players/player-side.enum';
import { PlayerPositionEnum } from '@/enums/match-players/player-position.enum';

export class CreateMatchPlayerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: PlayerPositionEnum.MF })
  @IsNotEmpty()
  @IsEnum(PlayerPositionEnum)
  position: PlayerPositionEnum;

  @ApiProperty({ example: PlayerSideEnum.HOME })
  @IsNotEmpty()
  @IsEnum(PlayerSideEnum)
  side: PlayerSideEnum;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isOrganizer: boolean;
}
