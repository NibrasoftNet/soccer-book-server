import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { createMap, Mapper, MappingProfile } from 'automapper-core';
import { SubscriptionToTeam } from '../entities/subscription-to-team.entity';
import { SubscriptionToTeamDto } from '@/domains/subscription-to-team/subscription-to-team.dto';

export class SubscriptionToTeamSerializationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, SubscriptionToTeam, SubscriptionToTeamDto);
    };
  }
}
