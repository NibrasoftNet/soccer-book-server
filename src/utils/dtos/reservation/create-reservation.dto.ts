import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationCreatorEnum } from '@/enums/reservation/reservation-type.enum';

export class CreateReservationDto {
  @ApiProperty()
  @ValidateIf((dto) => dto.type === ReservationCreatorEnum.TEAM)
  @IsNotEmpty()
  @IsString()
  homeId: string;

  @ApiProperty()
  @ValidateIf((dto) => dto.type === ReservationCreatorEnum.TEAM)
  @IsNotEmpty()
  @IsString()
  awayId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  day: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'openTime must be in the format HH:mm',
  })
  startHour: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'openTime must be in the format HH:mm',
  })
  endHour: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(ReservationCreatorEnum)
  type: ReservationCreatorEnum;
}
