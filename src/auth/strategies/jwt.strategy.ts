import { ExtractJwt, Strategy } from 'passport-jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { JwtPayloadType } from './types/jwt-payload.type';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    configService: ConfigService<AllConfigType>,
    private readonly i18n: I18nService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.secret', { infer: true }),
    });
  }

  validate(payload: JwtPayloadType): JwtPayloadType {
    if (!payload.id) {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          errors: {
            auth: this.i18n.t('auth.userNotAuthorized', {
              lang: I18nContext.current()?.lang,
            }),
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return payload;
  }
}
