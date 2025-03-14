import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
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
      scope: ['profile', 'email', 'openid'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(_accessToken: string, _refreshToken: string, profile: any) {
    return profile;
  }
}
