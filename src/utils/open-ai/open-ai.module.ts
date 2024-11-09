import { Module, Global } from '@nestjs/common';
import { OpenAiProvider } from './open-ai.provider';
import { OpenAiService } from './open-ai.service';

@Global()
@Module({
  providers: [OpenAiProvider, OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
