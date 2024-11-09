import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import winston, { LoggerOptions } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { ILoggerOptionService } from './logger.options-service.interface';
import TransportStream from 'winston-transport';

@Injectable()
export class LoggerOptionService implements ILoggerOptionService {
  constructor(private configService: ConfigService) {}

  createLogger(): LoggerOptions {
    const nodeEnv = this.configService.get<boolean>('app.nodeEnv', {
      infer: true,
    });

    const writeIntoConsole = nodeEnv === 'development';

    const transports: TransportStream[] = [];

    if (writeIntoConsole) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.json(),
            winston.format.timestamp(),
            winston.format.errors({ stacks: true }),
            nestWinstonModuleUtilities.format.nestLike('Soccer Book', {
              colors: true,
              prettyPrint: true,
              appName: true,
            }),
          ),
        }),
      );
    }

    return {
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint(),
      ),
      transports,
    };
  }
}
