// src/core/exceptions/system.exception.ts

import { AppException } from './app.exception';

export class SystemException extends AppException {
  readonly kind = 'SYSTEM' as const;
  readonly errorCode = 'SYS_001';

  // biome-ignore lint/complexity/noUselessConstructor: Expone públicamente el constructor protegido de AppException.
  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
