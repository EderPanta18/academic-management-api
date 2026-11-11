// application/exceptions/role-security.exceptions.ts

import { RoleException } from '@authorization/domain/exceptions';

export class RoleSelfEscalationException extends RoleException {
  readonly reason = 'CONFLICT' as const;
  readonly errorCode = 'AUTHZ_ROLE_SELF_ESCALATION';

  constructor(id: string) {
    super(
      `No se permite modificar el rol "${id}" porque aumentaría los permisos efectivos de la propia cuenta.`,
    );
  }
}
