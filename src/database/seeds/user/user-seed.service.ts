import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Address } from '../../../address/entities/address.entity';
import { faker } from '@faker-js/faker';
import { UserFactory } from './user.factory';
import { FileEntity } from '../../../files/entities/file.entity';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(FileEntity)
    private fileEntityRepository: Repository<FileEntity>,
    private userFactory: UserFactory,
  ) {}

  async run() {
    const users = await this.repository.count();

    if (!users) {
      const users = faker.helpers.multiple(
        () => this.repository.create(this.userFactory.createRandomUser()),
        {
          count: 10,
        },
      );
      for (const user of users) {
        user.address = await this.addressRepository.save(user.address);
        await this.repository.save(user);
      }
    }
  }
}
