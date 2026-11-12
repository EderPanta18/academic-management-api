// src/modules/authorization/infrastructure/persistence/state/authorization-state.mapper.ts

import type { AssignedRoleAuthorizationState } from '@authorization/application/ports/out';
import type { Prisma } from '@prisma/client';

export type AuthorizationStateRaw = Prisma.UserRoleGetPayload<{
  include: {
    role: {
      include: {
        rolePermissions: {
          include: {
            permission: true;
          };
        };
      };
    };
  };
}>;

export class AuthorizationStateMapper {
  static toState(raw: AuthorizationStateRaw): AssignedRoleAuthorizationState {
    return {
      roleId: raw.roleId,
      roleCode: raw.role.code,
      permissions: raw.role.rolePermissions.map(({ permission }) => ({
        id: permission.id,
        code: permission.code,
        name: permission.name,
        description: permission.description,
        module: permission.module,
        isReserved: permission.isReserved,
      })),
    };
  }
}
