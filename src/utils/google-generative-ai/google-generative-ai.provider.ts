import { Provider } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

export const GoogleGenerativeAIProvider: Provider = {
  provide: 'GoogleGenerativeAI',
  useFactory: (configService: ConfigService) => {
    const apiKey = configService.getOrThrow<string>(
      'googleGenerativeAI.apiKey',
      {
        infer: true,
      },
    );
    const modelName = configService.getOrThrow<string>(
      'googleGenerativeAI.modelName',
      {
        infer: true,
      },
    );
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({
      model: modelName,
    });
  },
  inject: [ConfigService],
};
