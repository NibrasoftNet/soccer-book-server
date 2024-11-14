import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { HttpException, HttpStatus } from '@nestjs/common';

function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
) {
  const validatedConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new HttpException(
      `{"validation": "${errors.toString()}"}`,
      HttpStatus.PRECONDITION_FAILED,
    );
  }
  return validatedConfig;
}

export default validateConfig;
