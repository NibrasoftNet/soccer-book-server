import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { NullableType } from '../utils/types/nullable.type';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { AuthEmailLoginDto } from '@/domains/auth/auth-email-login.dto';
import { SessionResponseDto } from '@/domains/session/session-response.dto';
import { AuthEmailRegisterDto } from '@/domains/auth/auth-email-register.dto';
import { ConfirmOtpEmailDto } from '@/domains/otp/confirm-otp-email.dto';
import { AuthForgotPasswordDto } from '@/domains/auth/auth-forgot-password.dto';
import { AuthResetPasswordDto } from '@/domains/auth/auth-reset-password.dto';
import { AuthUpdateDto } from '@/domains/auth/auth-update.dto';
import { UserDto } from '@/domains/user/user.dto';
import { AuthNewPasswordDto } from '@/domains/auth/auth-new-password.dto';
import { FileFastifyInterceptor, MulterFile } from 'fastify-file-interceptor';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly service: AuthService,
    @InjectMapper()
    private mapper: Mapper,
  ) {}

  @Post('email-login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<SessionResponseDto> {
    return await this.service.validateLogin(loginDto);
  }

  @Post('email-register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: AuthEmailRegisterDto,
  ): Promise<boolean> {
    return await this.service.register(createUserDto);
  }

  @Post('email-confirm')
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    @Body() confirmOtpEmailDto: ConfirmOtpEmailDto,
  ): Promise<void> {
    return await this.service.confirmEmail(confirmOtpEmailDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return await this.service.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    return await this.service.resetPassword(resetPasswordDto);
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async me(@Request() request): Promise<SessionResponseDto> {
    return await this.service.me(request.user);
  }

  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async refresh(@Request() request): Promise<SessionResponseDto> {
    return await this.service.refreshToken({
      id: request.user.id,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async logout(@Request() request): Promise<void> {
    await this.service.logout({
      id: request.user.id,
    });
  }

  @ApiConsumes('multipart/form-data')
  @ApiExtraModels(AuthUpdateDto)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        data: {
          $ref: getSchemaPath(AuthUpdateDto),
        },
      },
    },
  })
  @ApiBearerAuth()
  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(User, UserDto))
  @UseInterceptors(FileFastifyInterceptor('file'))
  public async update(
    @Request() request,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: MulterFile | Express.MulterS3.File,
  ): Promise<NullableType<User>> {
    const updateUserDto = new AuthUpdateDto(data);
    await Utils.validateDtoOrFail(updateUserDto);
    return await this.service.update(request.user, updateUserDto, file);
  }

  @ApiBearerAuth()
  @Put('me/new-password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Request() request,
    @Body() newPasswordDto: AuthNewPasswordDto,
  ): Promise<void> {
    return await this.service.newPassword(request.user, newPasswordDto);
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async delete(@Request() request): Promise<void> {
    return await this.service.softDelete(request.user);
  }
}
