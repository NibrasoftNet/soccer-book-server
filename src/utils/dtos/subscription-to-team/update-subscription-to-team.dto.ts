import { PartialType } from '@nestjs/swagger';
import { CreateSubscriptionToTeamDto } from './create-subscription-to-team.dto';

export class UpdateSubscriptionToTeamDto extends PartialType(
  CreateSubscriptionToTeamDto,
) {}
