import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTeamReservationDto } from './create-team-reservation.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ReservationTypeEnum } from '@/enums/reservation/reservation-type.enum';

export class UpdateTeamReservationDto extends PartialType(
  CreateTeamReservationDto,
) {
  @ApiProperty()
  @IsOptional()
  @IsEnum(ReservationTypeEnum)
  status: ReservationTypeEnum;
}
