import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export const OpenAiProvider: Provider = {
  provide: 'OpenAI',
  useFactory: (configService: ConfigService) => {
    const apiKey = configService.getOrThrow<string>('openAI.openAiApiKey', {
      infer: true,
    });
    return new OpenAI({
      apiKey,
    });
  },
  inject: [ConfigService],
};
