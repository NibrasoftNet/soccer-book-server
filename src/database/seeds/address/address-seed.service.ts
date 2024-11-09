import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Address } from '../../../address/entities/address.entity';
import { AddressFactory } from './address.factory';
import { faker } from '@faker-js/faker';

@Injectable()
export class AddressSeedService {
  constructor(
    @InjectRepository(Address)
    private repository: Repository<Address>,
    private addressFactory: AddressFactory,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save(
        faker.helpers.multiple(
          () => this.repository.create(this.addressFactory.generateRandom()),
          {
            count: 30,
          },
        ),
      );
    }
  }
}
