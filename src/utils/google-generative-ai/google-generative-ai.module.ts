import { Module, Global } from '@nestjs/common';
import { GoogleGenerativeAIProvider } from './google-generative-ai.provider';
import { GoogleGenerativeAIService } from './google-generative-ai.service';

@Global()
@Module({
  providers: [GoogleGenerativeAIProvider, GoogleGenerativeAIService],
  exports: [GoogleGenerativeAIService],
})
export class GoogleGenerativeAIModule {}
