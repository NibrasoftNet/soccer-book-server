import { Controller } from '@nestjs/common';
import { OauthGoogleService } from './oauth-google.service';

@Controller('oauth-google')
export class OauthGoogleController {
  constructor(private readonly oauthGoogleService: OauthGoogleService) {}
}
