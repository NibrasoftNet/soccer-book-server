import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { MailService } from '../mail/mail.service';
import { NullableType } from '../utils/types/nullable.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import { OtpService } from 'src/otp/otp.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Status } from '../statuses/entities/status.entity';
import { AuthEmailLoginDto } from '@/domains/auth/auth-email-login.dto';
import { AuthProvidersEnum } from '@/enums/auth/auth-provider.enum';
import { StatusCodeEnum } from '@/enums/status/statuses.enum';
import { ConfirmOtpEmailDto } from '@/domains/otp/confirm-otp-email.dto';
import { AuthResetPasswordDto } from '@/domains/auth/auth-reset-password.dto';
import { AuthUpdateDto } from '@/domains/auth/auth-update.dto';
import { AuthNewPasswordDto } from '@/domains/auth/auth-new-password.dto';
import { SharedService } from '../shared-module/shared.service';
import { UsersAdminService } from '../users-admin/users-admin.service';
import { UserAdmin } from '../users-admin/entities/user-admin.entity';
import { UserAdminDto } from '@/domains/user-admin/user-admin.dto';
import { SessionAdminResponseDto } from '@/domains/session/session-admin-response.dto';

@Injectable()
export class AuthAdminService {
  constructor(
    private usersAdminService: UsersAdminService,
    private mailService: MailService,
    private otpService: OtpService,
    private sharedService: SharedService,
    @InjectMapper() private mapper: Mapper,
    private readonly i18n: I18nService,
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
  ): Promise<SessionAdminResponseDto> {
    const user = await this.usersAdminService.findOneOrFail({
      email: loginDto.email,
    });

    if (user.provider !== AuthProvidersEnum.EMAIL) {
      throw new UnprocessableEntityException(
        `{"email": "${this.i18n.t('auth.loggedWithSocial', { lang: I18nContext.current()?.lang })}:${user.provider}"}`,
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException(
        `{"password": "${this.i18n.t('auth.invalidPassword', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    if (user.status?.id === StatusCodeEnum.INACTIVE) {
      await this.sendConfirmEmail(user.email);
      throw new ForbiddenException(
        `{"email": "${this.i18n.t('auth.emailNotConfirmed', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    if (loginDto.notificationsToken) {
      await this.usersAdminService.update(user.id, {
        notificationsToken: loginDto.notificationsToken,
      });
    }

    const { accessToken, refreshToken, tokenExpires } =
      await this.sharedService.getTokensData({
        id: user.id,
        role: user.role,
      });

    return new SessionAdminResponseDto({
      accessToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, UserAdmin, UserAdminDto),
    });
  }

  async confirmEmail(confirmOtpEmailDto: ConfirmOtpEmailDto): Promise<void> {
    await this.otpService.verifyOtp(confirmOtpEmailDto);
    const user = await this.usersAdminService.findOne({
      email: confirmOtpEmailDto.email,
    });

    if (!user) {
      throw new NotFoundException(
        `{"user": "${this.i18n.t('auth.userNotFound', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    user.status = plainToClass(Status, {
      id: StatusCodeEnum.ACTIVE,
      code: StatusCodeEnum.ACTIVE,
    });
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersAdminService.findOne({
      email,
    });

    if (!user) {
      throw new UnprocessableEntityException(
        `{"email":${this.i18n.t('auth.emailNotExists', { lang: I18nContext.current()?.lang })}}`,
      );
    }
    await this.sendForgetPasswordEmail(email);
  }

  async resetPassword(resetPasswordDto: AuthResetPasswordDto): Promise<void> {
    const user = await this.usersAdminService.findOneOrFail({
      email: resetPasswordDto.email,
    });

    if (!user) {
      throw new NotFoundException(
        `{"user": "${this.i18n.t('auth.userNotFound', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    user.password = resetPasswordDto.password;
    await user.save();
  }

  async me(userJwtPayload: JwtPayloadType): Promise<SessionAdminResponseDto> {
    const user = await this.usersAdminService.findOneOrFail({
      id: userJwtPayload.id,
    });
    const { accessToken, refreshToken, tokenExpires } =
      await this.sharedService.getTokensData({
        id: user.id,
        role: user.role,
      });
    return new SessionAdminResponseDto({
      accessToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, UserAdmin, UserAdminDto),
    });
  }

  async update(
    userJwtPayload: JwtPayloadType,
    updateUserDto: AuthUpdateDto,
    files?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<NullableType<UserAdmin>> {
    return await this.usersAdminService.update(
      userJwtPayload.id,
      updateUserDto,
      files,
    );
  }

  async newPassword(
    userJwtPayload: JwtPayloadType,
    newPasswordDto: AuthNewPasswordDto,
  ): Promise<void> {
    const user = await this.usersAdminService.findOneOrFail({
      id: userJwtPayload.id,
    });
    const isValidPassword = await bcrypt.compare(
      newPasswordDto.oldPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException(
        `{"password": "${this.i18n.t('auth.invalidPassword', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    await this.usersAdminService.update(userJwtPayload.id, {
      password: newPasswordDto.newPassword,
    });
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'id'>,
  ): Promise<SessionAdminResponseDto> {
    const user = await this.usersAdminService.findOneOrFail({
      id: data.id,
    });

    const { accessToken, refreshToken, tokenExpires } =
      await this.sharedService.getTokensData({
        id: user.id,
        role: user.role,
      });

    return new SessionAdminResponseDto({
      accessToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, UserAdmin, UserAdminDto),
    });
  }

  async softDelete(user: UserAdmin): Promise<void> {
    await this.usersAdminService.softDelete(user.id);
  }

  logout(data: Pick<JwtRefreshPayloadType, 'id'>) {
    return data;
  }

  async sendConfirmEmail(email: string) {
    // OTP Generation
    const otp = await this.otpService.createOtp({ email });
    await this.mailService.userSignUp({
      to: email,
      data: {
        otp,
      },
    });
  }

  async sendForgetPasswordEmail(email: string) {
    // OTP Generation
    const otp = await this.otpService.createOtp({ email });
    await this.mailService.forgotPassword({
      to: email,
      data: {
        otp,
      },
    });
  }
}