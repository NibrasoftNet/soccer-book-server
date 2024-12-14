import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { ApiTags } from '@nestjs/swagger';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Address } from './entities/address.entity';
import { Mapper } from 'automapper-core';
import { AddressDto } from '@/domains/address/address.dto';
import { CreateAddressDto } from '@/domains/address/create-address.dto';
import { UpdateAddressDto } from '@/domains/address/update-address.dto';
import { NullableType } from '../utils/types/nullable.type';
import { DeleteResult } from 'typeorm';

@ApiTags('Address')
@Controller({ path: 'address', version: '1' })
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @UseInterceptors(MapInterceptor(Address, AddressDto))
  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() createAddressDto: CreateAddressDto): Promise<Address> {
    return await this.addressService.create(createAddressDto);
  }

  @UseInterceptors(MapInterceptor(Address, AddressDto, { isArray: true }))
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<Address[]> {
    return await this.addressService.findAll();
  }

  @UseInterceptors(MapInterceptor(Address, AddressDto))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<Address>> {
    return await this.addressService.findOne({ id });
  }

  @UseInterceptors(MapInterceptor(Address, AddressDto))
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    return await this.addressService.update(id, updateAddressDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.addressService.remove(id);
  }
}
