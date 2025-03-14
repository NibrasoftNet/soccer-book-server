import { ValidateIf } from 'class-validator';
import { Type } from '@nestjs/common';

export function ValidateIfType<T>(
  classRef: Type<T>,
  condition: (obj: any, value: any) => boolean,
): Type<Partial<T>> {
  class ValidateIfClass {}

  // Use Reflect to get property keys and metadata
  const prototype = classRef.prototype;
  const propertyKeys = Reflect.ownKeys(prototype) as string[];

  propertyKeys.forEach((key) => {
    // Apply ValidateIf decorator dynamically
    ValidateIf(condition)(ValidateIfClass.prototype, key);

    // Propagate ApiProperty metadata for Swagger documentation
    const apiMetadata = Reflect.getMetadata(
      'swagger/apiModelProperties',
      prototype,
      key,
    );
    if (apiMetadata) {
      Reflect.defineMetadata(
        'swagger/apiModelProperties',
        apiMetadata,
        ValidateIfClass.prototype,
        key,
      );
    }

    // Define the property on the new class prototype
    Object.defineProperty(ValidateIfClass.prototype, key, {
      value: undefined,
      writable: true,
      enumerable: true,
    });
  });

  return ValidateIfClass as Type<Partial<T>>;
}
