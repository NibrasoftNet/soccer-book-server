import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  DeleteResult,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Address } from './entities/address.entity';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
  ) {}

  async create(payload: DeepPartial<Address>): Promise<Address> {
    const address = this.addressRepository.create(payload);
    return await this.addressRepository.save(address);
  }

  async findAll(fields?: FindOptionsWhere<Address>): Promise<Address[]> {
    return await this.addressRepository.find({ where: fields });
  }

  async findOne(
    fields: FindOptionsWhere<Address>,
  ): Promise<NullableType<Address>> {
    return await this.addressRepository.findOne({
      where: fields,
    });
  }

  async findOneOrFail(fields: FindOptionsWhere<Address>): Promise<Address> {
    return await this.addressRepository.findOneOrFail({
      where: fields,
    });
  }

  async findAllCities(): Promise<{ label: string; value: string }[]> {
    return await this.addressRepository
      .createQueryBuilder('address')
      .select('DISTINCT address.city AS label, address.city AS value')
      .getRawMany();
  }

  async update(id: string, payload: DeepPartial<Address>): Promise<Address> {
    const address = await this.findOneOrFail({ id });
    Object.assign(address, payload);
    return await this.addressRepository.save(address);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.addressRepository.delete(id);
  }
}
