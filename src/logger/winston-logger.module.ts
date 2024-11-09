import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { WinstonLoggerService } from './winston-logger.service';
import { LoggerOptionService } from './logger.options.service';
import { LoggerOptionsModule } from './logger.options.module';

@Global()
@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
  controllers: [],
  imports: [
    WinstonModule.forRootAsync({
      inject: [LoggerOptionService],
      imports: [LoggerOptionsModule],
      useFactory: (loggerOptionService: LoggerOptionService) =>
        loggerOptionService.createLogger(),
    }),
  ],
})
export class WinstonLoggerModule {}
