// src/core/exceptions/validation.exception.ts

import { AppException } from './app.exception';

export type FieldError = {
  field: string;
  messages: string[];
};

export class ValidationException extends AppException {
  readonly kind = 'VALIDATION';
  readonly errorCode = 'VAL_001';
  readonly fieldErrors: FieldError[];

  constructor(message: string, fieldErrors: FieldError[] = [], cause?: unknown) {
    super(message, cause);
    this.fieldErrors = ValidationException.normalize(fieldErrors);
  }

  private static normalize(fieldErrors: FieldError[]): FieldError[] {
    const grouped = new Map<string, Set<string>>();

    for (const { field, messages } of fieldErrors) {
      const existing = grouped.get(field) ?? new Set<string>();

      for (const message of messages) existing.add(message);

      grouped.set(field, existing);
    }

    return Array.from(grouped, ([field, messages]) => ({
      field,
      messages: [...messages],
    }));
  }
}
