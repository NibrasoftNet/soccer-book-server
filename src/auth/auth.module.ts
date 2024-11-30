import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';
import { IsExist } from '../utils/validators/is-exists.validator';
import { IsNotExist } from '../utils/validators/is-not-exists.validator';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { FilesModule } from '../files/files.module';
import { OtpModule } from 'src/otp/otp.module';
import { AuthAdminService } from './auth-admin.service';
import { UsersAdminModule } from '../users-admin/users-admin.module';
import { AuthAdminController } from './auth-admin.controller';

@Module({
  imports: [
    UsersModule,
    UsersAdminModule,
    PassportModule,
    MailModule,
    JwtModule.register({}),
    FilesModule,
    OtpModule,
  ],
  controllers: [AuthController, AuthAdminController],
  providers: [
    IsExist,
    IsNotExist,
    AuthService,
    AuthAdminService,
    JwtStrategy,
    JwtRefreshStrategy,
    AnonymousStrategy,
  ],
  exports: [AuthService, AuthAdminService],
})
export class AuthModule {}
