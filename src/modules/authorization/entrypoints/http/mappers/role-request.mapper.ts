// src/modules/authorization/entrypoints/http/mappers/role-request.mapper.ts

import type { CreateRoleCommand, UpdateRoleCommand } from '@authorization/application/commands';
import type { ListRolesQuery } from '@authorization/application/queries';
import type { CreateRoleRequestDto, ListRolesQueryDto, UpdateRoleRequestDto } from '../dtos';

export class RoleRequestMapper {
  static toListQuery(dto: ListRolesQueryDto): ListRolesQuery {
    return {
      isSystem: dto.isSystem,
      search: dto.search,
    };
  }

  static toCreateCommand(dto: CreateRoleRequestDto): CreateRoleCommand {
    return {
      code: dto.code,
      name: dto.name,
      description: dto.description ?? null,
      permissionIds: dto.permissionIds,
    };
  }

  static toUpdateCommand(dto: UpdateRoleRequestDto): UpdateRoleCommand {
    return {
      name: dto.name,
      description: dto.description,
      permissionIds: dto.permissionIds,
    };
  }
}
