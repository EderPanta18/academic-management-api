// shared/presentation/pipes/validation.pipe.ts

import {
  BadRequestException,
  ValidationPipe as NestValidationPipe,
  ValidationError,
} from '@nestjs/common';

export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      // Transforma el body al tipo del DTO declarado en el parámetro
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },

      // Elimina propiedades no declaradas en el DTO
      whitelist: true,

      // Lanza error si el cliente envía propiedades no declaradas
      forbidNonWhitelisted: true,

      // Construye el error con el mismo contrato que DomainExceptionFilter
      exceptionFactory: (errors: ValidationError[]) => {
        const fieldErrors = ValidationPipe.flattenErrors(errors);

        return new BadRequestException({
          success: false,
          statusCode: 400,
          errorKey: 'VALIDATION_ERROR',
          errorCode: 'SYS_400',
          message: 'Los datos enviados no son válidos',
          fieldErrors,
        });
      },
    });
  }

  // Aplana el árbol anidado de ValidationError en un mapa campo → mensajes
  private static flattenErrors(
    errors: ValidationError[],
    parentField = '',
  ): Record<string, string[]> {
    return errors.reduce(
      (acc, error) => {
        const field = parentField
          ? `${parentField}.${error.property}`
          : error.property;

        if (error.constraints) {
          acc[field] = Object.values(error.constraints);
        }

        // Errores anidados (objetos dentro de DTOs)
        if (error.children?.length) {
          Object.assign(
            acc,
            ValidationPipe.flattenErrors(error.children, field),
          );
        }

        return acc;
      },
      {} as Record<string, string[]>,
    );
  }
}
