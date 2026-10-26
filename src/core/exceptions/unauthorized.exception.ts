// src/core/exceptions/unauthorized.exception.ts

import { AppException } from './app.exception';

export abstract class UnauthorizedException extends AppException {
  readonly kind = 'UNAUTHORIZED' as const;

  protected constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
