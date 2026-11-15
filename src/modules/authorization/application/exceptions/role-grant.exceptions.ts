// src/modules/authorization/application/exceptions/role-grant.exceptions.ts

import { AuthorizationException } from '@authorization/domain/exceptions';

export class RoleAlreadyAssignedException extends AuthorizationException {
  readonly reason = 'CONFLICT';
  readonly errorCode = 'AUTHZ_ROLE_ALREADY_ASSIGNED';

  constructor(userId: string, roleId: string) {
    super(`El rol "${roleId}" ya está asignado a la cuenta "${userId}".`);
  }
}

export class RoleNotAssignedException extends AuthorizationException {
  readonly reason = 'NOT_FOUND';
  readonly errorCode = 'AUTHZ_ROLE_NOT_ASSIGNED';

  constructor(userId: string, roleId: string) {
    super(`El rol "${roleId}" no está asignado a la cuenta "${userId}".`);
  }
}

export class RoleGrantChangeNotAllowedException extends AuthorizationException {
  readonly reason = 'CONFLICT';
  readonly errorCode = 'AUTHZ_ROLE_GRANT_CHANGE_NOT_ALLOWED';

  constructor(userId: string, roleCode: string) {
    super(
      `No se permite modificar la asignación del rol "${roleCode}" para la cuenta "${userId}".`,
    );
  }
}
