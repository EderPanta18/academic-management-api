// src/platform/http/pipes/request-validation.pipe.ts

import { type FieldError, ValidationException } from '@core/exceptions';
import { Injectable, ValidationPipe } from '@nestjs/common';
import type { ValidationError } from 'class-validator';

function collectFieldErrors(errors: ValidationError[]): FieldError[] {
  const grouped = new Map<string, string[]>();

  const visit = (entries: ValidationError[], prefix = ''): void => {
    for (const error of entries) {
      const field = prefix ? `${prefix}.${error.property}` : error.property;

      if (error.constraints) {
        const messages = grouped.get(field) ?? [];

        for (const message of Object.values(error.constraints))
          if (!messages.includes(message)) messages.push(message);

        grouped.set(field, messages);
      }

      if (error.children?.length) visit(error.children, field);
    }
  };

  visit(errors);

  return [...grouped.entries()].map(([field, messages]) => ({
    field,
    messages,
  }));
}

@Injectable()
export class RequestValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validationError: {
        target: false,
        value: false,
      },
      exceptionFactory: (errors: ValidationError[]) =>
        new ValidationException('Los datos enviados no son válidos.', collectFieldErrors(errors)),
    });
  }
}
