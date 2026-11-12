// src/modules/authorization/infrastructure/persistence/repositories/role-repository.mapper.ts

import { Role } from '@authorization/domain/entities';
import type { Role as RoleRaw } from '@prisma/client';

export class RoleRepositoryMapper {
  static toDomain(raw: RoleRaw): Role {
    return Role.reconstitute({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      isSystem: raw.isSystem,
    });
  }
}
