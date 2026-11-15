// src/modules/authorization/application/exceptions/role-uniqueness.exceptions.ts

import { RoleException } from '@authorization/domain/exceptions';

export class RoleCodeAlreadyExistsException extends RoleException {
  readonly reason = 'CONFLICT';
  readonly errorCode = 'AUTHZ_ROLE_CODE_ALREADY_EXISTS';

  constructor(code: string) {
    super(`Ya existe un rol con el código "${code}".`);
  }
}
