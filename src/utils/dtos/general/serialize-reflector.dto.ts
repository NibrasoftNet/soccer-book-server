import { ClassConstructor } from 'class-transformer';

export class SerializeReflectorDto {
  serialize: ClassConstructor<any>;
  groups?: string[];
}
