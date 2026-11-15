// src/modules/authorization/entrypoints/http/mappers/permission-request.mapper.ts

import type { ListPermissionsQuery } from '@authorization/application/queries';
import type { ListPermissionsQueryDto } from '../dtos';

export class PermissionRequestMapper {
  static toListQuery(dto: ListPermissionsQueryDto): ListPermissionsQuery {
    return {
      module: dto.module,
      isReserved: dto.isReserved,
      search: dto.search,
    };
  }
}
