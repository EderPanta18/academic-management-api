// src/modules/authorization/application/exceptions/role-query.exceptions.ts

import { RoleException } from '@authorization/domain/exceptions';

export class RoleNotFoundException extends RoleException {
  readonly reason = 'NOT_FOUND' as const;
  readonly errorCode = 'AUTHZ_ROLE_NOT_FOUND';

  constructor(id: string) {
    super(`No se encontró un rol con el id "${id}".`);
  }
}
