// src/modules/authorization/domain/policies/permission.policy.ts

import { ADMINISTRATIVE_ROLES } from '../constants';
import type { Permission } from '../models';

export class PermissionPolicy {
  static resolveEffectivePermissions(permissionsByRole: Permission[][]): string[] {
    return [
      ...new Set(
        permissionsByRole.flatMap((permissions) =>
          permissions.map((permission) => permission.code),
        ),
      ),
    ];
  }

  static hasRequiredPermissions(
    effectivePermissionCodes: string[],
    actorRoleCodes: string[],
    requiredPermissions: Permission[],
  ): boolean {
    if (requiredPermissions.length === 0) return false;

    const granted = new Set(effectivePermissionCodes);

    const isAdministrative = actorRoleCodes.some((code) => ADMINISTRATIVE_ROLES.has(code));

    return requiredPermissions.every(
      (permission) => granted.has(permission.code) && (!permission.isReserved || isAdministrative),
    );
  }
}
