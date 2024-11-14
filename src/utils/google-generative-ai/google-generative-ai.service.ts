import { Inject, Injectable } from '@nestjs/common';
import { MulterFile } from 'fastify-file-interceptor';

@Injectable()
export class GoogleGenerativeAIService {
  constructor(@Inject('GoogleGenerativeAI') private readonly model: any) {}

  async generateContent(
    parts: { text: string }[],
    file: MulterFile,
  ): Promise<any> {
    const base64Data = file.buffer.toString('base64');
    const image = {
      inlineData: {
        data: base64Data,
        mimeType: file.mimetype,
      },
    };
    /*    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    };*/
    return await this.model.generateContent(
      [...parts, image],
      //generationConfig,
    );
  }

  async generateContentFromBase64Image(
    parts: { text: string }[],
    base64Data: string,
    mimeType: string,
  ): Promise<any> {
    const image = {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };
    /*    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
    };*/
    return await this.model.generateContent(
      [...parts, image],
      //generationConfig,
    );
  }
}
