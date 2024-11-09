import { Module } from '@nestjs/common';
import { LoggerOptionService } from './logger.options.service';

@Module({
  providers: [LoggerOptionService],
  exports: [LoggerOptionService],
  imports: [],
})
export class LoggerOptionsModule {}
