// src/core/exceptions/conflict.exception.ts

import { AppException } from './app.exception';

export abstract class ConflictException extends AppException {
  readonly kind = 'CONFLICT';
  readonly statusCode = 409;

  protected constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
