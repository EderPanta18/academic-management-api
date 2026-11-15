// src/modules/authorization/entrypoints/http/mappers/permission-response.mapper.ts

import type { PermissionReadModel } from '@authorization/application/read-models';
import { createPaginatedResult, type PaginatedResult, type PaginationVO } from '@core/pagination';
import { PermissionReadModelResponseDto } from '../dtos';

export class PermissionResponseMapper {
  static toReadModelResponse(readModel: PermissionReadModel): PermissionReadModelResponseDto {
    const dto = new PermissionReadModelResponseDto();

    dto.id = readModel.id;
    dto.code = readModel.code;
    dto.name = readModel.name;
    dto.description = readModel.description;
    dto.module = readModel.module;
    dto.isReserved = readModel.isReserved;

    return dto;
  }

  static toPaginatedResponse(
    items: PermissionReadModel[],
    pagination: PaginationVO,
    totalItems: number,
  ): PaginatedResult<PermissionReadModelResponseDto> {
    const mappedItems = items.map(PermissionResponseMapper.toReadModelResponse);

    return createPaginatedResult(mappedItems, pagination, totalItems);
  }
}
