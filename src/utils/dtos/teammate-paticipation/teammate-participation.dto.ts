import { TeammateParticipationStatusEnum } from '@/enums/teammate-paticipation/teammate-participation.enum';
import { EntityHelperDto } from '../general/entity-helper.dto';
import { UserDto } from '@/domains/user/user.dto';
import { AutoMap } from 'automapper-classes';
import { TeammateDto } from '@/domains/teammate/teammate.dto';

export class TeammateParticipationDto extends EntityHelperDto {
  @AutoMap()
  id: string;

  @AutoMap(() => UserDto)
  creator: UserDto;

  @AutoMap(() => TeammateDto)
  teammate: TeammateDto;

  @AutoMap()
  status: TeammateParticipationStatusEnum;
}
