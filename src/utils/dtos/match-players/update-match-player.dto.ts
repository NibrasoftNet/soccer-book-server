import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CreateMatchPlayerDto } from '@/domains/match-players/create-match-player.dto';
import { PlayerInvitationStatusEnum } from '@/enums/match-players/player-match.enum';

export class UpdateMatchPlayerDto extends PartialType(CreateMatchPlayerDto) {
  @ApiProperty({ example: PlayerInvitationStatusEnum.PENDING })
  @IsOptional()
  @IsEnum(PlayerInvitationStatusEnum)
  accepted?: PlayerInvitationStatusEnum;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  goals?: number;
}
