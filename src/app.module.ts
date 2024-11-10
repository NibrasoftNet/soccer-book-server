import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, HeaderResolver } from 'nestjs-i18n';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './mail/mail.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AllConfigType } from './config/config.type';
import { OtpModule } from './otp/otp.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { EndLaterThanStartDateValidator } from './utils/validators/end-later-than-start-date.validator';
import { ImageExistsInS3Validator } from './utils/validators/image-exists-in-s3.validator';
import { AutomapperModule } from 'automapper-nestjs';
import { classes } from 'automapper-classes';
import { EntityHelperProfile } from './utils/serialization/entity-helper.profile';
import { OauthModule } from './oauth/oauth.module';
import googleConfig from './oauth-google/config/google.config';
import googleGenerativeAIConfig from './utils/google-generative-ai/google-generative-ai.config';
import openAiConfig from './utils/open-ai/open-ai.config';
import databaseConfig from './database/config/database.config';
import authConfig from './auth/config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './mail/config/mail.config';
import fileConfig from './files/config/file.config';
import path from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HealthModule } from './health/health.module';
import { IsNotUsedByOthers } from './utils/validators/is-not-used-by-others';
import { GoogleGenerativeAIModule } from './utils/google-generative-ai/google-generative-ai.module';
import { AwsS3Module } from './utils/aws-s3/aws-s3.module';
import { OpenAiModule } from './utils/open-ai/open-ai.module';
import { Module } from '@nestjs/common';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { WinstonLoggerModule } from './logger/winston-logger.module';
import { GraphileWorkerModule } from 'nestjs-graphile-worker';
import { NotificationModule } from './notification/notification.module';
import { NotificationTask } from './utils/graphile-worker/notification-task';
import { NotificationCronTask } from './utils/graphile-worker/notification-cronjob';
import { OauthGoogleModule } from './oauth-google/oauth-google.module';
import { TeamModule } from './team/team.module';
import { SubscriptionToTeamModule } from './subscription-to-team/subscription-to-team.module';
import { SharedModule } from './shared-module/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        googleConfig,
        googleGenerativeAIConfig,
        openAiConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      // eslint-disable-next-line
      dataSourceFactory: async (options: DataSourceOptions) => {
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, '/i18n/'), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get('app.headerLanguage', {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        transport: {
          host: configService.getOrThrow('mail.host', { infer: true }),
          port: configService.getOrThrow('mail.port', { infer: true }),
          //service: configService.getOrThrow('mail.service', { infer: true }),
          ignoreTLS: configService.getOrThrow('mail.ignoreTLS', {
            infer: true,
          }),
          secure: configService.getOrThrow('mail.secure', { infer: true }),
          requireTLS: configService.getOrThrow('mail.requireTLS', {
            infer: true,
          }),
          auth: {
            user: configService.getOrThrow('mail.user', { infer: true }),
            pass: configService.getOrThrow('mail.password', { infer: true }),
          },
        },
        defaults: {
          from: '"no-reploy" <helpdesk@no-reploy.com>',
        },
        template: {
          dir: __dirname + '/mail/templates',
          // adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    GraphileWorkerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connectionString: config.get('PG_CONNECTION'),
        //crontab: `0 4 * * * notification-cron`,
      }),
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    OtpModule,
    MailModule,
    OauthModule,
    HealthModule,
    GoogleGenerativeAIModule,
    OpenAiModule,
    AwsS3Module,
    SharedModule,
    TestimonialsModule,
    WinstonLoggerModule,
    NotificationModule,
    OauthGoogleModule,
    TeamModule,
    SubscriptionToTeamModule,
  ],

  providers: [
    EndLaterThanStartDateValidator,
    ImageExistsInS3Validator,
    EntityHelperProfile,
    IsNotUsedByOthers,
    NotificationTask,
    NotificationCronTask,
  ],
})
export class AppModule {}
