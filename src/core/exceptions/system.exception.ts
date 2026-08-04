// src/core/exceptions/system.exception.ts

import { AppException } from './app.exception';

export class SystemException extends AppException {
  readonly kind = 'SYSTEM';
  readonly statusCode = 500;
  readonly errorKey = 'INTERNAL_SERVER_ERROR';
  readonly errorCode = 'SYS_001';

  // biome-ignore lint/complexity/noUselessConstructor: Required because AppException has a protected constructor.
  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
