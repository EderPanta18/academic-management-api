// src/modules/authorization/entrypoints/http/controllers/permission.controller.ts

import { ListPermissionsUseCase } from '@authorization/application/use-cases';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SwaggerTag } from '@platform/http';
import { CurrentUserId } from '@shared/decorators';
import { ApiListPermissions } from '../decorators';
import { ListPermissionsQueryDto, PermissionReadModelResponseDto } from '../dtos';
import { PermissionRequestMapper, PermissionResponseMapper } from '../mappers';

const PERMISSION_ROUTES = {
  ROOT: 'permissions',
} as const;

export const PERMISSION_SWAGGER_TAG = {
  name: 'permissions',
  description: 'Endpoints relacionados con la consulta del catálogo de permisos.',
} as const satisfies SwaggerTag;

@ApiTags(PERMISSION_SWAGGER_TAG.name)
@Controller(PERMISSION_ROUTES.ROOT)
export class PermissionController {
  constructor(private readonly listPermissionsUseCase: ListPermissionsUseCase) {}

  @Get()
  @ApiListPermissions()
  async list(
    @CurrentUserId() actorUserId: string,
    @Query() queryDto: ListPermissionsQueryDto,
  ): Promise<PermissionReadModelResponseDto[]> {
    const query = PermissionRequestMapper.toListQuery(queryDto);

    const items = await this.listPermissionsUseCase.execute(actorUserId, query);

    return PermissionResponseMapper.toListResponse(items);
  }
}
