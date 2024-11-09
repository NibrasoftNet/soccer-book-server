import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { NullableType } from '../utils/types/nullable.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from '../config/config.type';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import {
  runOnTransactionComplete,
  runOnTransactionRollback,
  Transactional,
} from 'typeorm-transactional';
import { OtpService } from 'src/otp/otp.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Status } from '../statuses/entities/status.entity';
import { SessionResponseDto } from '@/domains/session/session-response.dto';
import { AuthEmailLoginDto } from '@/domains/auth/auth-email-login.dto';
import { AuthProvidersEnum } from '@/enums/auth/auth-provider.enum';
import { StatusCodeEnum } from '@/enums/status/statuses.enum';
import { UserDto } from '@/domains/user/user.dto';
import { AuthEmailRegisterDto } from '@/domains/auth/auth-email-register.dto';
import { CreateUserDto } from '@/domains/user/create-user.dto';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { RoleDto } from '@/domains/role/role.dto';
import { StatusesDto } from '@/domains/status/statuses.dto';
import { ConfirmOtpEmailDto } from '@/domains/otp/confirm-otp-email.dto';
import { AuthResetPasswordDto } from '@/domains/auth/auth-reset-password.dto';
import { AuthUpdateDto } from '@/domains/auth/auth-update.dto';
import { AuthNewPasswordDto } from '@/domains/auth/auth-new-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailService: MailService,
    private otpService: OtpService,
    private configService: ConfigService<AllConfigType>,
    @InjectMapper() private mapper: Mapper,
    private readonly i18n: I18nService,
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
  ): Promise<SessionResponseDto> {
    const user = await this.usersService.findOneOrFail({
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
      await this.usersService.update(user.id, {
        notificationsToken: loginDto.notificationsToken,
      });
    }

    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: user.id,
        role: user.role,
      });

    return new SessionResponseDto({
      accessToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, User, UserDto),
    });
  }

  async register(authEmailRegisterDto: AuthEmailRegisterDto): Promise<boolean> {
    // Attempt to restore a soft-deleted user by email
    const restoredUser = await this.usersService.restoreUserByEmail(
      authEmailRegisterDto.email,
    );

    const newUser = new CreateUserDto({
      email: authEmailRegisterDto.email,
      role: {
        id: RoleCodeEnum.USER,
      } as RoleDto,
      status: {
        id: StatusCodeEnum.INACTIVE,
      } as StatusesDto,
      address: authEmailRegisterDto.address,
      firstName: authEmailRegisterDto.firstName,
      lastName: authEmailRegisterDto.lastName,
      password: authEmailRegisterDto.password,
      provider: AuthProvidersEnum.EMAIL,
      socialId: null,
    });
    const user = restoredUser
      ? restoredUser
      : await this.usersService.create(newUser);
    await this.sendConfirmEmail(user.email);
    return true;
  }

  async confirmEmail(confirmOtpEmailDto: ConfirmOtpEmailDto): Promise<void> {
    await this.otpService.verifyOtp(confirmOtpEmailDto);
    const user = await this.usersService.findOne({
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
    const user = await this.usersService.findOne({
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
    const user = await this.usersService.findOneOrFail({
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

  async me(
    userJwtPayload: JwtPayloadType,
    notificationToken?: string,
  ): Promise<SessionResponseDto> {
    const user = await this.usersService.findOneOrFail({
      id: userJwtPayload.id,
    });
    if (notificationToken) {
      await this.usersService.update(user.id, {
        notificationsToken: notificationToken,
      });
    }

    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: user.id,
        role: user.role,
      });
    return new SessionResponseDto({
      accessToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, User, UserDto),
    });
  }

  async update(
    userJwtPayload: JwtPayloadType,
    updateUserDto: AuthUpdateDto,
    files?: Express.Multer.File | Express.MulterS3.File,
  ): Promise<NullableType<User>> {
    return await this.usersService.update(
      userJwtPayload.id,
      updateUserDto,
      files,
    );
  }

  async newPassword(
    userJwtPayload: JwtPayloadType,
    newPasswordDto: AuthNewPasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findOneOrFail({
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

    await this.usersService.update(userJwtPayload.id, {
      password: newPasswordDto.newPassword,
    });
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'id'>,
  ): Promise<SessionResponseDto> {
    const user = await this.usersService.findOneOrFail({
      id: data.id,
    });

    const { accessToken, refreshToken, tokenExpires } =
      await this.getTokensData({
        id: user.id,
        role: user.role,
      });

    return new SessionResponseDto({
      accessToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, User, UserDto),
    });
  }

  @Transactional()
  async softDelete(user: User): Promise<void> {
    runOnTransactionRollback(() =>
      console.log(`Account Deletion transaction rolled back`),
    );
    runOnTransactionComplete((error) => {
      if (!!error) {
        console.log(`Account Deletion transaction failed`);
      }
      console.log(`Account Deletion transaction completed`);
    });

    await this.usersService.softDelete(user.id);
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

  async getTokensData(data: { id: User['id']; role: User['role'] }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      tokenExpires,
    };
  }
}
