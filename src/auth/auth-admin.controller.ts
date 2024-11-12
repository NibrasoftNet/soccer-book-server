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
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { NullableType } from '../utils/types/nullable.type';
import { InjectMapper, MapInterceptor } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { ParseFormdataPipe } from '../utils/pipes/parse-formdata.pipe';
import { Utils } from '../utils/utils';
import { AuthEmailLoginDto } from '@/domains/auth/auth-email-login.dto';
import { AuthForgotPasswordDto } from '@/domains/auth/auth-forgot-password.dto';
import { AuthResetPasswordDto } from '@/domains/auth/auth-reset-password.dto';
import { AuthUpdateDto } from '@/domains/auth/auth-update.dto';
import { CreateUserDto } from '@/domains/user/create-user.dto';
import { AuthNewPasswordDto } from '@/domains/auth/auth-new-password.dto';
import { AuthAdminService } from './auth-admin.service';
import { SessionAdminResponseDto } from '@/domains/session/session-admin-response.dto';
import { UserAdmin } from '../users-admin/entities/user-admin.entity';
import { UserAdminDto } from '@/domains/user-admin/user-admin.dto';
import { FileFastifyInterceptor, MulterFile } from 'fastify-file-interceptor';

@ApiTags('Auth-admin')
@Controller({
  path: 'auth-admin',
  version: '1',
})
export class AuthAdminController {
  constructor(
    private readonly authAdminService: AuthAdminService,
    @InjectMapper()
    private mapper: Mapper,
  ) {}

  @Post('email-login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<SessionAdminResponseDto> {
    return await this.authAdminService.validateLogin(loginDto);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: AuthForgotPasswordDto,
  ): Promise<void> {
    return await this.authAdminService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: AuthResetPasswordDto,
  ): Promise<void> {
    return await this.authAdminService.resetPassword(resetPasswordDto);
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async me(@Request() request): Promise<SessionAdminResponseDto> {
    return await this.authAdminService.me(request.user);
  }

  @ApiBearerAuth()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @HttpCode(HttpStatus.OK)
  public async refresh(@Request() request): Promise<SessionAdminResponseDto> {
    return await this.authAdminService.refreshToken({
      id: request.user.id,
    });
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async logout(@Request() request): Promise<void> {
    await this.authAdminService.logout({
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
          $ref: getSchemaPath(CreateUserDto),
        },
      },
    },
  })
  @ApiBearerAuth()
  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(MapInterceptor(UserAdmin, UserAdminDto))
  @UseInterceptors(FileFastifyInterceptor('file'))
  public async update(
    @Request() request,
    @Body('data', ParseFormdataPipe) data,
    @UploadedFile() file?: MulterFile | Express.MulterS3.File,
  ): Promise<NullableType<UserAdmin>> {
    const updateUserDto = new AuthUpdateDto(data);
    await Utils.validateDtoOrFail(updateUserDto);
    return await this.authAdminService.update(
      request.user,
      updateUserDto,
      file,
    );
  }

  @ApiBearerAuth()
  @Put('me/new-password')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async newPassword(
    @Request() request,
    @Body() newPasswordDto: AuthNewPasswordDto,
  ): Promise<void> {
    return await this.authAdminService.newPassword(
      request.user,
      newPasswordDto,
    );
  }

  @ApiBearerAuth()
  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async delete(@Request() request): Promise<void> {
    return await this.authAdminService.softDelete(request.user);
  }
}
