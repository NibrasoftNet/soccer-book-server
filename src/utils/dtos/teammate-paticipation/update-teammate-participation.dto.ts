import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { TeammateParticipationStatusEnum } from '@/enums/teammate-paticipation/teammate-participation.enum';

export class UpdateTeammateParticipationDto {
  @ApiProperty()
  @IsEnum(TeammateParticipationStatusEnum)
  @IsString()
  status: string;
}
