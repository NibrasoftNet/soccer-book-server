import {
  DataSource,
  EntitySubscriberInterface,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { OrderedEntityHelper } from '../../entities/ordered-entity.helper';

@Injectable()
export class OrderedEntitySubscriber<T extends OrderedEntityHelper>
  implements EntitySubscriberInterface<T>
{
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  /**
   * Called before entity update.
   */
  async beforeUpdate(event: UpdateEvent<T>) {
    const { entity } = event;

    if (entity?.__orderedEntity) {
      const repository = await this.dataSource.getRepository(
        event.metadata.target,
      );
      const toUpdateObject = await repository.findOneByOrFail({
        id: entity.id,
      });
      if (toUpdateObject.order !== entity.order) {
        const allObjects = await repository.find();
        if (allObjects.length > 1) {
          allObjects.forEach((obj) => {
            if (obj.order >= entity.order) {
              obj.order += 1;
            }
          });
          await repository.save(allObjects);
        }
      }
      console.log(
        `BEFORE ENTITY UPDATED: `,
        entity,
        toUpdateObject,
        toUpdateObject.order,
        entity.order,
      );
    }
  }

  /**
   * Called before entity removal.
   */
  beforeRemove(event: RemoveEvent<any>) {
    console.log(
      `BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `,
      event.entity,
    );
  }
}
