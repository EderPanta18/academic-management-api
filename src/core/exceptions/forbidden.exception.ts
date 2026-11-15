// src/core/exceptions/forbidden.exception.ts

import { AppException } from './app.exception';

export abstract class ForbiddenException extends AppException {
  readonly kind = 'FORBIDDEN';

  protected constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
