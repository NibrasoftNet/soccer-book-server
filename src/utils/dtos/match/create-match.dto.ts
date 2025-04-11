import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '@/domains/user/user.dto';
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty()
  @ValidateIf((dto) => !dto.teamReservationId)
  @IsNotEmpty()
  @IsString()
  reservationId?: string;

  @ApiProperty()
  @ValidateIf((dto) => !dto.reservationId)
  @IsNotEmpty()
  @IsNumber()
  teamReservationId?: string;

  @ApiProperty()
  @IsNotEmpty()
  home: [UserDto];

  @ApiProperty()
  @IsNotEmpty()
  away: [UserDto];
}
