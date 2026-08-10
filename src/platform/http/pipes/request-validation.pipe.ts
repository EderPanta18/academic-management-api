// platform/http/pipes/request-validation.pipe.ts

import { type FieldError, ValidationException } from '@core/exceptions';
import { ValidationError, ValidationPipe } from '@nestjs/common';

export class RequestValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const fieldErrors = this.groupErrors(errors);

        throw new ValidationException('Los datos enviados no son válidos.', fieldErrors);
      },
    });
  }

  private groupErrors(errors: ValidationError[], parentField = ''): FieldError[] {
    const map = new Map<string, string[]>();

    const flatten = (errs: ValidationError[], prefix: string) => {
      for (const error of errs) {
        const field = prefix ? `${prefix}.${error.property}` : error.property;

        if (error.constraints) {
          const messages = Object.values(error.constraints);
          const existing = map.get(field) || [];
          map.set(field, [...existing, ...messages]);
        }

        if (error.children?.length) flatten(error.children, field);
      }
    };

    flatten(errors, parentField);

    return Array.from(map.entries()).map(([field, messages]) => ({
      field,
      messages,
    }));
  }
}
