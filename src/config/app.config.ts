import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import validateConfig from '.././utils/validate-config';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { EnvironmentEnum } from '@/enums/general/environment.enum';

class EnvironmentVariablesValidator {
  @IsEnum(EnvironmentEnum)
  @IsOptional()
  NODE_ENV: EnvironmentEnum;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsNotEmpty()
  APP_PORT: number;

  @IsString()
  @IsOptional()
  APP_HOST: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsNotEmpty()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;

  @IsNotEmpty()
  @IsString()
  SWAGGER_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 0,
    minUppercase: 0,
  })
  SWAGGER_PASSWORD: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'app',
    workingDirectory: process.env.PWD || process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    host: process.env.APP_HOST ?? '0.0.0.0',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
    swaggerUsername: process.env.SWAGGER_USERNAME || 'arena-book-swagger-auth',
    swaggerPassword: process.env.SWAGGER_PASSWORD || 'Arena-book@swagger123',
  };
});
