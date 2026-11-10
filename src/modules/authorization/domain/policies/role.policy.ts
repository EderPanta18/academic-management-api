// src/modules/authorization/domain/policies/role.policy.ts

import { ADMINISTRATIVE_ROLES, INSTITUTIONAL_ROLES } from '../constants';
import type { Role } from '../entities';
import type { Permission } from '../models';

type RoleAssignmentContext = {
  actorUserId: string;
  targetUserId: string;
  actorRoleCodes: string[];
  targetRoleCodes: string[];
  roleCode: string;
};

export class RolePolicy {
  static canConfigurePermissions(
    role: Role,
    requestedPermissionIds: string[],
    resolvedPermissions: Permission[],
  ): boolean {
    if (!role.isCustom()) return false;

    const permissionsById = new Map(
      resolvedPermissions.map((permission) => [permission.id, permission]),
    );

    return requestedPermissionIds.every((id) => {
      const permission = permissionsById.get(id);

      return permission !== undefined && !permission.isReserved;
    });
  }

  static wouldIncreaseOwnPermissions(
    actorHasRole: boolean,
    currentEffectivePermissionCodes: string[],
    proposedRolePermissionCodes: string[],
  ): boolean {
    if (!actorHasRole) return false;

    const currentPermissions = new Set(currentEffectivePermissionCodes);

    return proposedRolePermissionCodes.some((code) => !currentPermissions.has(code));
  }

  static canChangeAssignment(context: RoleAssignmentContext): boolean {
    const { actorUserId, targetUserId, actorRoleCodes, targetRoleCodes, roleCode } = context;

    if (actorUserId === targetUserId) return false;

    const { SUPER_ADMIN, ADMIN } = INSTITUTIONAL_ROLES;

    if (roleCode === SUPER_ADMIN || targetRoleCodes.includes(SUPER_ADMIN)) return false;

    const isAdministrative = actorRoleCodes.some((code) => ADMINISTRATIVE_ROLES.has(code));

    if (!isAdministrative) return false;

    const requiresSuperAdmin = roleCode === ADMIN || targetRoleCodes.includes(ADMIN);

    return !requiresSuperAdmin || actorRoleCodes.includes(SUPER_ADMIN);
  }
}
