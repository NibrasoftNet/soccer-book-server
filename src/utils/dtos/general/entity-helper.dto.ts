import { AfterLoad, BaseEntity } from 'typeorm';
import { AutoMap } from 'automapper-classes';
import { Exclude } from 'class-transformer';

export class EntityHelperDto extends BaseEntity {
  @Exclude()
  __entity: string;

  @AutoMap()
  createdAt: Date;

  @AutoMap()
  updatedAt: Date;

  @AfterLoad()
  setEntityName() {
    this.__entity = this.constructor.name;
  }
}
