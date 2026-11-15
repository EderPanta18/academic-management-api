// src/modules/authorization/entrypoints/http/mappers/role-response.mapper.ts

import type {
  RoleDetailReadModel,
  RoleReadModel,
  RoleUserReadModel,
} from '@authorization/application/read-models';
import type { Role } from '@authorization/domain/entities';
import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import {
  RoleDetailReadModelResponseDto,
  RoleReadModelResponseDto,
  RoleResponseDto,
  RoleUserReadModelResponseDto,
} from '../dtos';

export class RoleResponseMapper {
  static toResponse(role: Role): RoleResponseDto {
    const dto = new RoleResponseDto();

    dto.id = role.id;
    dto.code = role.code;
    dto.name = role.name;
    dto.description = role.description;
    dto.isSystem = role.isSystem;

    return dto;
  }

  static toDetailReadModelResponse(readModel: RoleDetailReadModel): RoleDetailReadModelResponseDto {
    const dto = new RoleDetailReadModelResponseDto();

    dto.id = readModel.id;
    dto.code = readModel.code;
    dto.name = readModel.name;
    dto.description = readModel.description;
    dto.isSystem = readModel.isSystem;
    dto.permissionIds = readModel.permissionIds;

    return dto;
  }

  static toPaginatedResponse(
    items: RoleReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<RoleReadModelResponseDto> {
    const mappedItems = items.map(RoleResponseMapper.toReadModelResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }

  static toPaginatedUsersResponse(
    items: RoleUserReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<RoleUserReadModelResponseDto> {
    const mappedItems = items.map(RoleResponseMapper.toUserReadModelResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }

  private static toReadModelResponse(readModel: RoleReadModel): RoleReadModelResponseDto {
    const dto = new RoleReadModelResponseDto();

    dto.id = readModel.id;
    dto.code = readModel.code;
    dto.name = readModel.name;
    dto.description = readModel.description;
    dto.isSystem = readModel.isSystem;

    return dto;
  }

  private static toUserReadModelResponse(
    readModel: RoleUserReadModel,
  ): RoleUserReadModelResponseDto {
    const dto = new RoleUserReadModelResponseDto();

    dto.userId = readModel.userId;
    dto.assignedAt = readModel.assignedAt;

    return dto;
  }
}
