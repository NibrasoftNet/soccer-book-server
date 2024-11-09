import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from 'nest-winston';

@Injectable()
export class WinstonLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly loggerWithProfile: Logger,
  ) {}

  info(description: string, data?: any): void {
    this.logger.log('📢 ' + description, { data });
  }

  debug(description: string, data?: any): void {
    this.logger.debug('🐞 ' + description, { data });
  }

  warn(description: string, data?: any): void {
    this.logger.warn('⚠️ ' + description, { data });
  }

  error(description: string, data?: any): void {
    this.logger.error('❌ ' + description, { data });
  }

  watch(description: string, data: any): () => void {
    this.loggerWithProfile.profile('⏱️ ' + description, data);

    return () => {
      this.loggerWithProfile.profile('⏱️ ' + description, data);
    };
  }
}
