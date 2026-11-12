// src/modules/authorization/infrastructure/persistence/queries/role-query.mapper.ts

import type {
  RoleDetailReadModel,
  RoleReadModel,
  RoleUserReadModel,
} from '@authorization/application/read-models';
import type { Prisma, Role as RoleReadRaw, UserRole as RoleUserReadRaw } from '@prisma/client';

export type RoleDetailReadRaw = Prisma.RoleGetPayload<{
  include: {
    rolePermissions: true;
  };
}>;

export class RoleQueryMapper {
  static toReadModel(Readraw: RoleReadRaw): RoleReadModel {
    return {
      id: Readraw.id,
      code: Readraw.code,
      name: Readraw.name,
      description: Readraw.description,
      isSystem: Readraw.isSystem,
    };
  }

  static toDetailReadModel(Readraw: RoleDetailReadRaw): RoleDetailReadModel {
    return {
      ...RoleQueryMapper.toReadModel(Readraw),
      permissionIds: Readraw.rolePermissions.map((relation) => relation.permissionId),
    };
  }

  static toUserReadModel(Readraw: RoleUserReadRaw): RoleUserReadModel {
    return {
      userId: Readraw.userId,
      assignedAt: Readraw.assignedAt,
    };
  }
}
