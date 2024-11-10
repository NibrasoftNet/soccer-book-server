import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'My team' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '#free palestine' })
  @IsNotEmpty()
  @IsString()
  bio: string;

  constructor({ name, bio }: { name: string; bio: string }) {
    this.name = name;
    this.bio = bio;
  }
}
