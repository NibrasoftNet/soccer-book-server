import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsTimestamp } from '../../validators/is-timestamp.validator';
import { TimestampPrecision } from '@/enums/general/timestamp.enum';

export class CreateReservationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsTimestamp(TimestampPrecision.SECONDS)
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
}
