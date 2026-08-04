// src/core/exceptions/domain.exception.ts

import { AppException } from './app.exception';

export abstract class DomainException extends AppException {
  readonly kind = 'DOMAIN';

  abstract readonly domain: string;

  protected constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
