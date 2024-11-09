import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  constructor(
    @Inject('OpenAI') private readonly model: OpenAI,
    private readonly configService: ConfigService,
  ) {}
}
