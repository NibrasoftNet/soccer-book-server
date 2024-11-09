import { registerAs } from '@nestjs/config';

export default registerAs('openAI', () => ({
  openAiApiKey: process.env.OPEN_AI_API_KEY,
  openAiModelName: process.env.OPEN_AI_MODEL_NAME,
}));
