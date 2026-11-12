// src/modules/authorization/infrastructure/persistence/queries/permission-query.mapper.ts

import type { PermissionReadModel } from '@authorization/application/read-models';
import type { Permission as PermissionReadRaw } from '@prisma/client';

export class PermissionQueryMapper {
  static toReadModel(raw: PermissionReadRaw): PermissionReadModel {
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
