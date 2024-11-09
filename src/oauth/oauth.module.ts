import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { OauthService } from './oauth.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule, FilesModule],
  controllers: [OauthController],
  providers: [OauthService],
})
export class OauthModule {}
