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
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { ApiTags } from '@nestjs/swagger';
import { Otp } from './entities/otp.entity';
import { DeleteResult } from 'typeorm';
import { NullableType } from '../utils/types/nullable.type';
import { CreateOtpDto } from '@/domains/otp/create-otp.dto';
import { ConfirmOtpEmailDto } from '@/domains/otp/confirm-otp-email.dto';
import { ResendVerifyOtpDto } from '@/domains/otp/verifyotp.dto';
@ApiTags('Otp')
@Controller({
  path: 'otp',
  version: '1',
})
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  /**
   * Create Otp
   * @returns {void}
   * @param createOtpDto
   */

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOtp(@Body() createOtpDto: CreateOtpDto): Promise<number> {
    return await this.otpService.createOtp(createOtpDto);
  }

  @Post('verify')
  @HttpCode(HttpStatus.CREATED)
  async verifyOtp(
    @Body() confirmOtpEmailDto: ConfirmOtpEmailDto,
  ): Promise<void> {
    await this.otpService.verifyOtp(confirmOtpEmailDto);
  }
  /**
   * Get all not confirmed otp
   * @returns {Promise<Otp[]>} List of all non-confirmed otp
   */

  @Get()
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(): Promise<Otp[]> {
    return await this.otpService.findAll();
  }

  /**
   * Get single not confirmed otp
   * @param id
   * @returns {Promise<Otp>} List of all non-confirmed otp
   */

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<NullableType<Otp>> {
    return await this.otpService.findOne({ id });
  }

  /**
   * Delete a reward by ID
   * @param id {number} category ID
   * @returns {Promise<DeleteResult>} deletion result
   */

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return await this.otpService.remove(id);
  }

  /**
   * re-Send Otp to received phone
   * @returns {void}
   * @param resendVerifyOtpDto
   */

  @Put('verify/resend')
  @HttpCode(HttpStatus.CREATED)
  async resendOtp(
    @Body() resendVerifyOtpDto: ResendVerifyOtpDto,
  ): Promise<void> {
    await this.otpService.resendOtp(resendVerifyOtpDto);
  }
}
