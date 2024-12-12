import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { AutoMap } from 'automapper-classes';
import { Type } from 'class-transformer';

export class UpdateTournamentDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    description: 'Name of the tournament',
    example: 'Champion League',
  })
  @AutoMap()
  @IsString()
  @IsOptional()
  arenaId?: string;

  @ApiProperty({
    description: 'Name of the tournament',
    example: 'Champion League',
  })
  @AutoMap()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description of the tournament',
    example: 'Annual championship for the best teams.',
  })
  @AutoMap()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Start date of the tournament',
    example: '2024-12-01T10:00:00.000Z',
  })
  @AutoMap()
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'Finish date of the tournament',
    example: '2024-12-15T18:00:00.000Z',
  })
  @AutoMap()
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  finishDate?: Date;

  @ApiProperty({
    description: 'Last date for subscription to the tournament',
    example: '2024-11-20T23:59:59.000Z',
  })
  @AutoMap()
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  lastSubscriptionDate?: Date;

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

  @AutoMap()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price: number;

  constructor({
    active,
    arenaId,
    name,
    description,
    startDate,
    finishDate,
    lastSubscriptionDate,
    numberOfTeams,
    price,
  }: {
    active?: boolean;
    arenaId?: string;
    name?: string;
    description?: string;
    startDate?: Date;
    finishDate?: Date;
    lastSubscriptionDate?: Date;
    numberOfTeams?: number;
    price: number;
  }) {
    this.active = active;
    this.arenaId = arenaId;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.finishDate = finishDate;
    this.lastSubscriptionDate = lastSubscriptionDate;
    this.numberOfTeams = numberOfTeams;
    this.price = price;
  }
}
