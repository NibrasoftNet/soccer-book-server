import { Module } from '@nestjs/common';
import { OauthGoogleService } from './oauth-google.service';
import { OauthGoogleController } from './oauth-google.controller';
import { UsersModule } from '../users/users.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [UsersModule],
  controllers: [OauthGoogleController],
  providers: [OauthGoogleService, GoogleStrategy],
})
export class OauthGoogleModule {}
