import { registerAs } from '@nestjs/config';

export default registerAs('googleGenerativeAI', () => ({
  apiKey: process.env.GENERATIVE_AI_API_KEY,
  modelName: process.env.GENERATIVE_AI_MODEL_NAME,
}));
