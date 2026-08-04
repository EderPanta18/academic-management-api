// src/core/exceptions/not-found.exception.ts

import { AppException } from './app.exception';

export abstract class NotFoundException extends AppException {
  readonly kind = 'NOT_FOUND';
  readonly statusCode = 404;

  protected constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
