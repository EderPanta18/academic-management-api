// platform/http/pipes/request-validation.pipe.ts

import type { ValidationError } from '@nestjs/common';
import { BadRequestException, ValidationPipe as NestValidationPipe } from '@nestjs/common';

import type { ApiErrorResponse } from '../responses';

type RequestValidationErrorPayload = Omit<ApiErrorResponse, 'timestamp' | 'path'>;

export class RequestValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const response: RequestValidationErrorPayload = {
          success: false,
          statusCode: 400,
          errorKey: 'VALIDATION_ERROR',
          errorCode: 'SYS_400',
          message: 'Los datos enviados no son válidos',
          fieldErrors: RequestValidationPipe.flattenErrors(errors),
        };

        return new BadRequestException(response);
      },
    });
  }

  private static flattenErrors(
    errors: ValidationError[],
    parentField = '',
  ): Record<string, string[]> {
    return errors.reduce<Record<string, string[]>>((acc, error) => {
      const field = parentField ? `${parentField}.${error.property}` : error.property;

      if (error.constraints) acc[field] = Object.values(error.constraints);

      if (error.children?.length)
        Object.assign(acc, RequestValidationPipe.flattenErrors(error.children, field));

      return acc;
    }, {});
  }
}
