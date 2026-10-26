// src/core/exceptions/not-found.exception.ts

import { AppException } from './app.exception';

export abstract class NotFoundException extends AppException {
  readonly kind = 'NOT_FOUND' as const;

  protected constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
