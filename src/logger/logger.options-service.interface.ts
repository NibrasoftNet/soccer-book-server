import { LoggerOptions } from 'winston';

export interface ILoggerOptionService {
  createLogger(): LoggerOptions;
}
