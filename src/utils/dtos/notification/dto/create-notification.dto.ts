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
import { Transform } from 'class-transformer';
import { UserDto } from '@/domains/user/user.dto';
import { NotificationTypeOfSendingEnum } from '@/enums/notification/notification-type-of-sending.enum';

export class CreateNotificationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message: string;

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

  @ApiProperty({ description: 'The selected users ID', type: Number })
  @IsNotEmpty()
  @IsArray()
  users: UserDto[];

  @ApiProperty()
  @ValidateIf(
    (dto) => dto.typeOfSending === NotificationTypeOfSendingEnum.PUNCTUAL,
  )
  @IsNotEmpty()
  @Transform(({ value }) => value && new Date(value))
  @IsDate()
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
  scheduledNotification?: Date[];

  constructor({
    title,
    message,
    forAllUsers,
    typeOfSending,
    users,
    punctualSendDate,
    scheduledNotification,
  }: {
    title: string;
    message: string;
    forAllUsers: boolean;
    typeOfSending: NotificationTypeOfSendingEnum;
    users: UserDto[];
    punctualSendDate?: Date;
    scheduledNotification?: Date[];
  }) {
    this.title = title;
    this.message = message;
    this.forAllUsers = forAllUsers;
    this.typeOfSending = typeOfSending;
    this.users = users;
    this.punctualSendDate = punctualSendDate;
    this.scheduledNotification = scheduledNotification;
  }
}
