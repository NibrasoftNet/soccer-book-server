import { AddressService } from './address.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Address } from './entities/address.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { Repository } from 'typeorm';
import { Utils } from '../utils/utils';
import { AddressFactory } from '../database/seeds/address/address.factory';
import { faker } from '@faker-js/faker';

describe('Address service', () => {
  let addressService: AddressService;
  let moduleRef: TestingModule;
  let addressRepository: Repository<Address>;
  const addressFactory: AddressFactory = new AddressFactory();
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: getRepositoryToken(Address),
          useValue: Utils.createRepositoryMock<Address>(),
        },
      ],
    }).compile();
    await module.init();
    moduleRef = module;
    addressService = module.get(AddressService);
    addressRepository = module.get(getRepositoryToken(Address));
  });

  it('AddressService should be defined', () => {
    expect(addressService).toBeDefined();
  });
  it('create', async () => {
    // arrange
    const address = addressFactory.generateRandom();
    const createAddressDto = { ...address } as CreateAddressDto;
    jest.spyOn(addressRepository, 'save').mockResolvedValue(address);
    // act
    const result = await addressService.create(createAddressDto);
    // assert
    expect(addressRepository.save).toBeCalled();
    expect(result).toEqual(address);
  });

  it('findAll', async () => {
    //arrange
    const addresses = faker.helpers.multiple(
      () => addressFactory.generateRandom(),
      {
        count: 5,
      },
    );
    jest.spyOn(addressRepository, 'find').mockResolvedValue(addresses);
    //act
    const result = await addressService.findAll();

    // assert
    expect(result).toEqual(addresses);
    expect(addressRepository.find).toBeCalled();
    expect(addressRepository.find).toBeCalledWith({ where: undefined });
  });
  it('findOne', async () => {
    const address = addressFactory.generateRandom();
    jest.spyOn(addressRepository, 'findOne').mockResolvedValue(address);
    //act
    const result = await addressService.findOne({ id: 1 });

    // assert
    expect(result).toEqual(address);
    expect(addressRepository.find).toBeCalled();
  });

  it('remove', async () => {
    //arrange
    const address = addressFactory.generateRandom();
    address.id = 1;
    const deleteResult = {
      raw: address,
      affected: 1,
    };
    jest.spyOn(addressRepository, 'delete').mockResolvedValue(deleteResult);
    //act
    const result = await addressService.remove(address.id);

    // assert
    expect(result).toEqual(deleteResult);
    expect(addressRepository.delete).toBeCalled();
  });

  afterAll(async () => {
    await moduleRef.close();
  });
});
