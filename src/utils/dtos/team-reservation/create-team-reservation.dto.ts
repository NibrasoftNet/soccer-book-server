import { IsDateString, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamReservationDto {
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
}
