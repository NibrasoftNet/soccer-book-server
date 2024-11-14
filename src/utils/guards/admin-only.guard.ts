import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
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
      throw new HttpException(
        `{"email":${this.i18n.t('auth.emailNotExists', { lang: I18nContext.current()?.lang })}}`,
        HttpStatus.PRECONDITION_REQUIRED,
      );
    }

    // Fetch user details using the AuthService
    const user = await this.authService.me(userJwtPayload);

    // Check if the user has the required role (assuming roleId 1 means admin)
    if (user?.user.role === 'ADMIN') {
      return true;
    }
    throw new HttpException(
      `{"email": "${this.i18n.t('auth.emailNotConfirmed', { lang: I18nContext.current()?.lang })}"}`,

      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}
