// src/core/exceptions/validation.exception.ts

import { AppException } from './app.exception';

export type FieldError = {
  field: string;
  messages: string[];
};

export class ValidationException extends AppException {
  readonly kind = 'VALIDATION';
  readonly statusCode = 400;
  readonly errorKey = 'VALIDATION_ERROR';
  readonly errorCode = 'VAL_001';
  readonly fieldErrors: FieldError[];

  constructor(message: string, fieldErrors: FieldError[] = [], cause?: unknown) {
    super(message, cause);

    this.fieldErrors = ValidationException.normalize(fieldErrors);
  }

  private static normalize(fieldErrors: FieldError[]): FieldError[] {
    const map = new Map<string, string[]>();

    for (const { field, messages } of fieldErrors) {
      const existing = map.get(field);
      if (existing) {
        const newMessages = messages.filter((msg) => !existing.includes(msg));
        existing.push(...newMessages);
      } else {
        map.set(field, [...messages]);
      }
    }

    return Array.from(map.entries()).map(([field, messages]) => ({
      field,
      messages,
    }));
  }
}
