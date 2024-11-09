import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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

@ApiTags('Address')
@Controller({ path: 'address', version: '1' })
export class AddressController {
  constructor(
    private readonly addressService: AddressService,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createAddressDto: CreateAddressDto) {
    return await this.addressService.create(createAddressDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Address, AddressDto, { isArray: true }))
  async findAll(): Promise<Address[]> {
    return await this.addressService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Address, AddressDto))
  async findOne(@Param('id') id: string) {
    return await this.addressService.findOne({ id });
  }

  @Get('find/all-cities')
  @HttpCode(HttpStatus.OK)
  async findAllCities() {
    return await this.addressService.findAllCities();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(Address, AddressDto))
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return await this.addressService.update(id, updateAddressDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.addressService.remove(id);
  }
}
