// src/auth/guards/admin-only.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AdminOnlyGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userJwtPayload = request.user; // Assuming you store user details in the request after authentication

    if (!userJwtPayload) {
      throw new UnauthorizedException(
        `{"email":${this.i18n.t('auth.emailNotExists', { lang: I18nContext.current()?.lang })}}`,
      );
    }

    // Fetch user details using the AuthService
    const user = await this.authService.me(userJwtPayload);

    // Check if the user has the required role (assuming roleId 1 means admin)
    if (user?.user.role === 'admin') {
      return true;
    }
    throw new ForbiddenException(
      `{"email": "${this.i18n.t('auth.emailNotConfirmed', { lang: I18nContext.current()?.lang })}"}`,
    );
  }
}
