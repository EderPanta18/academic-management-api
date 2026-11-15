// src/modules/authorization/entrypoints/http/mappers/permission-response.mapper.ts

import type { PermissionReadModel } from '@authorization/application/read-models';
import { PermissionReadModelResponseDto } from '../dtos';

export class PermissionResponseMapper {
  static toListResponse(items: PermissionReadModel[]): PermissionReadModelResponseDto[] {
    return items.map(PermissionResponseMapper.toReadModelResponse);
  }

  private static toReadModelResponse(
    readModel: PermissionReadModel,
  ): PermissionReadModelResponseDto {
    const dto = new PermissionReadModelResponseDto();

    dto.id = readModel.id;
    dto.code = readModel.code;
    dto.name = readModel.name;
    dto.description = readModel.description;
    dto.module = readModel.module;
    dto.isReserved = readModel.isReserved;

    return dto;
  }
}
