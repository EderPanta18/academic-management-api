// src/core/exceptions/unauthorized.exception.ts

import { AppException } from './app.exception';

export abstract class UnauthorizedException extends AppException {
  readonly kind = 'UNAUTHORIZED';
  readonly statusCode = 401;

  protected constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
