// src/modules/authorization/domain/exceptions/authorization.exception.ts

import { DomainException } from '@core/exceptions';

export abstract class AuthorizationException extends DomainException {
  readonly domain = 'AUTHORIZATION';

  abstract readonly entity: string;
}
