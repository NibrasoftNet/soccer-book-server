import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.getOrThrow('GOOGLE_AUTH_CLIENT_ID', {
        infer: true,
      }),
      clientSecret: configService.getOrThrow('GOOGLE_AUTH_CLIENT_SECRET', {
        infer: true,
      }),
      callbackURL: configService.getOrThrow('GOOGLE_AUTH_REDIRECT_URI', {
        infer: true,
      }),
      scope: ['profile', 'email'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(_accessToken: string, _refreshToken: string, profile: any) {
    return profile;
  }
}
