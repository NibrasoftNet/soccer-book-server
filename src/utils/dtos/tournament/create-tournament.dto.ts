import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AutoMap } from 'automapper-classes';
import {
  CompareDate,
  DateComparisonMethod,
} from '../../validators/compare-date.validator';

export class CreateTournamentDto {
  @ApiProperty({
    description: 'Name of the tournament',
    example: 'Champion League',
  })
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the tournament',
    example: 'Annual championship for the best teams.',
  })
  @AutoMap()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Start date of the tournament',
    example: '2024-12-01T10:00:00.000Z',
  })
  @AutoMap()
  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  @CompareDate(new Date(), DateComparisonMethod.GREATER)
  startDate: Date;

  @ApiProperty({
    description: 'Finish date of the tournament',
    example: '2024-12-15T18:00:00.000Z',
  })
  @AutoMap()
  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  @CompareDate('startDate', DateComparisonMethod.GREATER)
  finishDate: Date;

  @ApiProperty({
    description: 'Last date for subscription to the tournament',
    example: '2024-11-20T23:59:59.000Z',
  })
  @AutoMap()
  @IsNotEmpty()
  @IsDateString()
  @Type(() => Date)
  @CompareDate('finishDate', DateComparisonMethod.LESS)
  lastSubscriptionDate: Date;

  @ApiProperty({
    description: 'Number of teams allowed in the tournament (maximum 2 digits)',
    example: 10,
    minimum: 2,
    maximum: 99,
  })
  @AutoMap()
  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(99)
  numberOfTeams?: number;

  constructor({
    name,
    description,
    startDate,
    finishDate,
    lastSubscriptionDate,
    numberOfTeams,
  }: {
    name: string;
    description: string;
    startDate: Date;
    finishDate: Date;
    lastSubscriptionDate: Date;
    numberOfTeams?: number;
  }) {
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.finishDate = finishDate;
    this.lastSubscriptionDate = lastSubscriptionDate;
    this.numberOfTeams = numberOfTeams;
  }
}
