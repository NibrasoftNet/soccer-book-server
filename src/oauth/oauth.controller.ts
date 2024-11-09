import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OauthVerifyDto } from '@/domains/oauth/oauth-verify.dto';
import { SessionResponseDto } from '@/domains/session/session-response.dto';
import { OauthRegisterDto } from '@/domains/oauth/oauth-register.dto';
import { OauthService } from './oauth.service';

@ApiTags('OAuth')
@Controller({
  path: 'oauth',
  version: '1',
})
export class OauthController {
  constructor(private readonly oAuthService: OauthService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifySocialSubscription(
    @Body() oauthVerifyDto: OauthVerifyDto,
  ): Promise<SessionResponseDto | false> {
    const user =
      await this.oAuthService.verifySocialSubscription(oauthVerifyDto);
    if (!user) return false;
    return this.oAuthService.validateSocialLogin(oauthVerifyDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async validateSocialRegister(
    @Body() oauthRegisterDto: OauthRegisterDto,
  ): Promise<SessionResponseDto> {
    return this.oAuthService.validateSocialRegister(oauthRegisterDto);
  }
}
