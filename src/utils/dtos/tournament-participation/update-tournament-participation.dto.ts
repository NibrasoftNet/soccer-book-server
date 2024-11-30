import { PartialType } from '@nestjs/swagger';
import { CreateTournamentParticipationDto } from './create-tournament-participation.dto';

export class UpdateTournamentParticipationDto extends PartialType(
  CreateTournamentParticipationDto,
) {}
