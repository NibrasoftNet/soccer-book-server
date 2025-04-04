import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserDto } from '@/domains/user/user.dto';
import { NotificationTypeOfSendingEnum } from '@/enums/notification/notification-type-of-sending.enum';
import {
  CompareDate,
  DateComparisonMethod,
} from '../../validators/compare-date.validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  forAllUsers: boolean;

  @ApiProperty({
    enum: NotificationTypeOfSendingEnum,
    example: NotificationTypeOfSendingEnum.IMMEDIATELY,
  })
  @IsEnum(NotificationTypeOfSendingEnum)
  @IsNotEmpty()
  typeOfSending: NotificationTypeOfSendingEnum;

  @ApiProperty({ description: 'The selected users ID', type: [UserDto] })
  @ValidateIf((dto) => dto.forAllUsers === false)
  @IsNotEmpty()
  @IsArray()
  users: UserDto[];

  @ApiProperty({
    description: 'Start date of the tournament',
    example: '2024-12-01T10:00:00.000Z',
  })
  @ValidateIf(
    (dto) => dto.typeOfSending === NotificationTypeOfSendingEnum.PUNCTUAL,
  )
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @CompareDate(new Date(), DateComparisonMethod.GREATER)
  punctualSendDate?: Date;

  @ApiProperty({
    type: Date,
    isArray: true,
  })
  @ValidateIf(
    (dto) => dto.typeOfSending === NotificationTypeOfSendingEnum.PROGRAMMED,
  )
  @IsNotEmpty()
  @Transform(({ value }) => value && value.map((date) => new Date(date)))
  @IsDate({ each: true })
  scheduledNotification?: Date[] | null;

  constructor(data: Partial<CreateNotificationDto>) {
    Object.assign(this, data);
  }
}
