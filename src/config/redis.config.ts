import { registerAs } from '@nestjs/config';
import validateConfig from '.././utils/validate-config';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsNotEmpty()
  REDIS_PORT: number;

  @IsString()
  @IsNotEmpty()
  REDIS_HOST: string;
}

export default registerAs('redis', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  };
});
