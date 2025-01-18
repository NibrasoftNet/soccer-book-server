import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateReservationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero
    return date;
  })
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
