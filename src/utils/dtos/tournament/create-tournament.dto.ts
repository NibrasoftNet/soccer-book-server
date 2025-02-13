import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CompareDate,
  DateComparisonMethod,
} from '../../validators/compare-date.validator';
import { TournamentTypeEnum } from '@/enums/tournament/tournament-type.enum';

export class CreateTournamentDto {
  @ApiProperty({
    description: 'Name of the tournament',
    example: 'Champion League',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the tournament',
    example: 'Annual championship for the best teams.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Start date of the tournament',
    example: '2024-12-01T10:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  @CompareDate(new Date(), DateComparisonMethod.GREATER)
  startDate: Date;

  @ApiProperty({
    description: 'Finish date of the tournament',
    example: '2024-12-15T18:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  @CompareDate('startDate', DateComparisonMethod.GREATER)
  finishDate: Date;

  @ApiProperty({
    description: 'Last date for subscription to the tournament',
    example: '2024-11-20T23:59:59.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  @CompareDate('finishDate', DateComparisonMethod.LESS)
  lastSubscriptionDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TournamentTypeEnum)
  type: TournamentTypeEnum;

  @ApiProperty({
    description: 'Number of teams allowed in the tournament (maximum 2 digits)',
    example: 10,
    minimum: 2,
    maximum: 99,
  })
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(99)
  numberOfTeams?: number;

  @ApiProperty({
    description: 'Subscription price to the tournament',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  constructor({
    name,
    description,
    startDate,
    finishDate,
    lastSubscriptionDate,
    type,
    numberOfTeams,
    price,
  }: {
    name: string;
    description: string;
    startDate: Date;
    finishDate: Date;
    lastSubscriptionDate: Date;
    type: TournamentTypeEnum;
    numberOfTeams?: number;
    price: number;
  }) {
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.finishDate = finishDate;
    this.lastSubscriptionDate = lastSubscriptionDate;
    this.type = type;
    this.numberOfTeams = numberOfTeams;
    this.price = price;
  }
}
