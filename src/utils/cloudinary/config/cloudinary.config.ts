import { registerAs } from '@nestjs/config';
import { IsOptional, IsString, ValidateIf } from 'class-validator';
import validateConfig from '../../validate-config';
import { CloudinaryConfig } from './cloudinary-config.type';

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => !envValues.CLOUDINARY_NAME)
  @IsString()
  @IsOptional()
  CLOUDINARY_NAME: string;

  @ValidateIf((envValues) => !envValues.CLOUDINARY_API_KEY)
  @IsString()
  @IsOptional()
  CLOUDINARY_API_KEY: string;

  @ValidateIf((envValues) => !envValues.CLOUDINARY_API_SECRET)
  @IsString()
  @IsOptional()
  CLOUDINARY_API_SECRET: string;
}

export default registerAs<CloudinaryConfig>('cloudinary', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
});
