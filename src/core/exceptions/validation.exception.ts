// src/core/exceptions/validation.exception.ts

import { AppException } from './app.exception';

export type FieldError = {
  field?: string;
  message: string;
};

export class ValidationException extends AppException {
  readonly kind = 'VALIDATION';
  readonly statusCode = 400;
  readonly errorKey = 'VALIDATION_ERROR';
  readonly errorCode = 'VAL_001';
  readonly fieldErrors: FieldError[];

  constructor(message: string, fieldErrors: FieldError[] = [], cause?: unknown) {
    super(message, cause);
    this.fieldErrors = fieldErrors;
  }
}
