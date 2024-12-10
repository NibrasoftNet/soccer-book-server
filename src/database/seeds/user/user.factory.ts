import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../../../users/entities/user.entity';
import { Role } from '../../../roles/entities/role.entity';
import { Status } from '../../../statuses/entities/status.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { AddressFactory } from '../address/address.factory';
import { Address } from '../../../address/entities/address.entity';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { StatusCodeEnum } from '@/enums/status/statuses.enum';

@Injectable()
export class UserFactory {
  constructor(
    @InjectRepository(User)
    private repositoryUser: Repository<User>,
    @InjectRepository(Role)
    private repositoryRole: Repository<Role>,
    @InjectRepository(Status)
    private repositoryStatus: Repository<Status>,
    @InjectRepository(Address)
    private repositoryAddress: Repository<Address>,
    private addressFactory: AddressFactory,
  ) {}

  createRandomUser() {
    // Need for saving "this" context

    const activeStatus = {
      id: StatusCodeEnum.ACTIVE,
      name: 'ACTIVE',
      code: StatusCodeEnum.ACTIVE,
    } as Status;
    const inactiveStatus = {
      id: StatusCodeEnum.INACTIVE,
      name: 'INACTIVE',
      code: StatusCodeEnum.INACTIVE,
    } as Status;
    const userRole = {
      id: RoleCodeEnum.USER,
      name: 'USER',
      code: RoleCodeEnum.USER,
    } as Role;
    const adminRole = {
      id: RoleCodeEnum.ADMIN,
      name: 'ADMIN',
      code: RoleCodeEnum.ADMIN,
    } as Role;
    return {
      userName: faker.person.firstName(),
      email: faker.internet.email().toLowerCase(),
      password: 'H@mza12345',
      role: faker.helpers.arrayElement<Role>([userRole, adminRole]),
      status: faker.helpers.arrayElement<Status>([
        activeStatus,
        inactiveStatus,
      ]),
      address: this.addressFactory.generateRandom(),
    } as User;
  }
}
