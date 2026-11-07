// src/modules/authorization/domain/entities/role/role.exceptions.ts

import { RoleException } from '@authorization/domain/exceptions';

export class ProtectedRoleException extends RoleException {
  readonly reason = 'CONFLICT' as const;
  readonly errorCode = 'AUTH_ROLE_PROTECTED';

  constructor() {
    super('No se permite modificar un rol institucional.');
  }
}
