// src/modules/authorization/infrastructure/persistence/repositories/permission-repository.mapper.ts

import type { Permission } from '@authorization/domain/models';
import type { Permission as PermissionRaw } from '@prisma/client';

export class PermissionRepositoryMapper {
  static toDomain(raw: PermissionRaw): Permission {
    return {
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      module: raw.module,
      isReserved: raw.isReserved,
    };
  }
}
