// src/modules/users/domain/exceptions/user.exception.ts

import { DomainException } from '@core/exceptions';

export abstract class UserException extends DomainException {
  readonly domain = 'USERS';

  readonly entity: string = 'user';
}
