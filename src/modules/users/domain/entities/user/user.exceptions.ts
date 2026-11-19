// src/modules/users/domain/entities/user/user.exceptions.ts

import { UserException } from '@users/domain/exceptions';
import type { UserStatus } from './user.enums';

export class UserAlreadyInStatusException extends UserException {
  readonly reason = 'CONFLICT';
  readonly errorCode = 'USER_STATUS_ALREADY_SET';

  constructor(id: string, status: UserStatus) {
    super(`La cuenta "${id}" ya se encuentra en estado "${status}".`);
  }
}

export class InvalidUserStatusTransitionException extends UserException {
  readonly reason = 'CONFLICT';
  readonly errorCode = 'USER_STATUS_TRANSITION_NOT_ALLOWED';

  constructor(currentStatus: UserStatus, targetStatus: UserStatus) {
    super(
      `No se permite cambiar el estado de la cuenta de "${currentStatus}" a "${targetStatus}".`,
    );
  }
}

export class UserNotBlockedException extends UserException {
  readonly reason = 'CONFLICT';
  readonly errorCode = 'USER_NOT_BLOCKED';

  constructor(id: string) {
    super(`La cuenta "${id}" no se encuentra bloqueada.`);
  }
}

export class UserAlreadyLinkedToPersonException extends UserException {
  readonly reason = 'CONFLICT';
  readonly errorCode = 'USER_PERSON_ALREADY_LINKED';

  constructor(id: string) {
    super(`La cuenta "${id}" ya tiene una persona vinculada.`);
  }
}
