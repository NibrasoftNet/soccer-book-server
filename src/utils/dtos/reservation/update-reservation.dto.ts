import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReservationDto } from './create-reservation.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ReservationTypeEnum } from '@/enums/reservation/reservation-type.enum';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiProperty()
  @IsOptional()
  @IsEnum(ReservationTypeEnum)
  status: ReservationTypeEnum;
}
