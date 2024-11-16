import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import { FilesService } from '../files/files.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Utils } from '../utils/utils';
import { OauthVerifyDto } from '@/domains/oauth/oauth-verify.dto';
import { SessionResponseDto } from '@/domains/session/session-response.dto';
import { OauthRegisterDto } from '@/domains/oauth/oauth-register.dto';
import { RoleCodeEnum } from '@/enums/role/roles.enum';
import { RoleDto } from '@/domains/role/role.dto';
import { StatusCodeEnum } from '@/enums/status/statuses.enum';
import { StatusesDto } from '@/domains/status/statuses.dto';
import { CreateFileDto } from '@/domains/files/create-file.dto';
import { CreateUserDto } from '@/domains/user/create-user.dto';
import { UserDto } from '@/domains/user/user.dto';
import { Status } from '../statuses/entities/status.entity';
import { AuthService } from '../auth/auth.service';
import { SharedService } from '../shared-module/shared.service';

@Injectable()
export class OauthService {
  constructor(
    private usersService: UsersService,
    private readonly authService: AuthService,
    private fileService: FilesService,
    private sharedService: SharedService,
    @InjectMapper() private mapper: Mapper,
    private readonly i18n: I18nService,
  ) {}

  async verifySocialSubscription(
    oauthVerifyDto: OauthVerifyDto,
  ): Promise<boolean> {
    // Check if user already previously logged in using OAUTH
    const user = await this.usersService.findOne({
      email: oauthVerifyDto.email.toLowerCase(),
    });
    return !!user;
  }

  async validateSocialRegister(
    oauthRegisterDto: OauthRegisterDto,
  ): Promise<SessionResponseDto> {
    const { email, photo } = oauthRegisterDto;
    const socialEmail = email?.toLowerCase();

    const picture = photo
      ? await this.fileService.createFileFromUrl(photo)
      : null;
    const profilePhoto = picture
      ? new CreateFileDto({
          id: picture.id,
          path: picture?.path,
        })
      : null;
    // Attempt to restore a soft-deleted user by email
    const restoredUser =
      await this.usersService.restoreUserByEmail(socialEmail);
    const newUser = new CreateUserDto({
      email,
      role: {
        id: RoleCodeEnum.USER,
        code: RoleCodeEnum.USER,
      } as RoleDto,
      status: {
        id: StatusCodeEnum.ACTIVE,
        code: StatusCodeEnum.ACTIVE,
      } as StatusesDto,
      address: oauthRegisterDto.address,
      photo: profilePhoto,
      userName: oauthRegisterDto.userName ?? 'anonymous',
      provider: oauthRegisterDto.provider,
      socialId: oauthRegisterDto.id,
    });
    await Utils.validateDtoOrFail(newUser);

    // Use the restored user if available, otherwise create a new user
    const user = restoredUser
      ? restoredUser
      : await this.usersService.create(newUser);

    if (!user) {
      throw new NotFoundException(
        `{"user": "${this.i18n.t('auth.userNotFound', { lang: I18nContext.current()?.lang })}"}`,
      );
    }

    const {
      accessToken: jwtToken,
      refreshToken,
      tokenExpires,
    } = await this.sharedService.getTokensData({
      id: user.id,
      role: user.role,
    });

    return new SessionResponseDto({
      accessToken: jwtToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, User, UserDto),
    });
  }

  async validateSocialLogin(
    oauthVerifyDto: OauthVerifyDto,
  ): Promise<SessionResponseDto> {
    const socialEmail = oauthVerifyDto.email.toLowerCase();

    // Check if user already exists
    const user = await this.usersService.findOneOrFail({
      email: socialEmail,
    });

    // Check if user previously logged in using OAUTH
    const socialOAuthUser = await this.usersService.findOne({
      socialId: oauthVerifyDto.id,
      provider: oauthVerifyDto.provider,
    });

    // If previously logged in using email and password, replace it by OAuth
    if (!socialOAuthUser) {
      user.socialId = oauthVerifyDto.id;
      user.provider = oauthVerifyDto.provider;
      user.status = {
        id: StatusCodeEnum.ACTIVE,
        code: StatusCodeEnum.ACTIVE,
      } as Status;
      await this.usersService.update(user.id, user);
    }

    const {
      accessToken: jwtToken,
      refreshToken,
      tokenExpires,
    } = await this.sharedService.getTokensData({
      id: user.id,
      role: user.role,
    });

    return new SessionResponseDto({
      accessToken: jwtToken,
      refreshToken,
      tokenExpires,
      user: this.mapper.map(user, User, UserDto),
    });
  }
}
