import { RoleException } from '@authorization/domain/exceptions';

export class ProtectedRoleException extends RoleException {
  readonly reason = 'CONFLICT' as const;
  readonly errorCode = 'AUTHZ_ROLE_PROTECTED';

  constructor() {
    super('No se permite modificar un rol institucional.');
  }
}

export class ReservedRoleCodeException extends RoleException {
  readonly reason = 'CONFLICT' as const;
  readonly errorCode = 'AUTHZ_ROLE_CODE_RESERVED';

  constructor(code: string) {
    super(`El código "${code}" está reservado para un rol institucional.`);
  }
}
