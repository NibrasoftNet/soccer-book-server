import EntityHelper from './entity-helper';
import { AfterLoad, Column, Generated } from 'typeorm';

export class OrderedEntityHelper extends EntityHelper {
  @Column()
  @Generated('increment')
  order: number;

  __orderedEntity?: boolean;

  @AfterLoad()
  setOrderedEntity() {
    this.__orderedEntity = this instanceof OrderedEntityHelper;
  }
}
