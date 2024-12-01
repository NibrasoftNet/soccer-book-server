import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { UserDto } from '@/domains/user/user.dto';
import { Transform } from 'class-transformer';
import {
  CompareDate,
  DateComparisonMethod,
} from '../../validators/compare-date.validator';

export class UpdateNotificationDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isNotificationSent?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(64)
  title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({ description: 'The selected users ID', type: Number })
  @IsOptional()
  @IsArray()
  users?: UserDto[];

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  @CompareDate(new Date(), DateComparisonMethod.GREATER)
  punctualSendDate?: Date;

  @ApiProperty({
    type: Date,
    isArray: true,
  })
  @IsOptional()
  @Transform(({ value }) => value && value.map((date) => new Date(date)))
  @IsDate({ each: true })
  scheduledNotification?: Date[];
}
