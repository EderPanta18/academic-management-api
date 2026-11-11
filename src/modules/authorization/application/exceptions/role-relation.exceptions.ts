import { RoleException } from '@authorization/domain/exceptions';

export class RolePermissionNotFoundException extends RoleException {
  readonly reason = 'NOT_FOUND' as const;
  readonly errorCode = 'AUTHZ_ROLE_PERMISSION_NOT_FOUND';

  constructor(permissionIds: string[]) {
    super(
      `No se encontraron permisos con los IDs: ${permissionIds.map((id) => `"${id}"`).join(', ')}.`,
    );
  }
}

export class RolePermissionNotAssignableException extends RoleException {
  readonly reason = 'CONFLICT' as const;
  readonly errorCode = 'AUTHZ_ROLE_PERMISSION_NOT_ASSIGNABLE';

  constructor(permissionIds: string[]) {
    super(
      `Los permisos con IDs ${permissionIds.map((id) => `"${id}"`).join(', ')} están reservados y no pueden asignarse a un rol personalizado.`,
    );
  }
}
