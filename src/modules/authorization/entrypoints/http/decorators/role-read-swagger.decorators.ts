// src/modules/authorization/entrypoints/http/decorators/role-read-swagger.decorators.ts

import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiPaginatedResult } from '@shared/decorators';
import {
  RoleDetailReadModelResponseDto,
  RoleReadModelResponseDto,
  RoleUserReadModelResponseDto,
} from '../dtos';

export function ApiListRoles(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Listar roles con paginación' }),
    ApiQuery({
      name: 'isSystem',
      required: false,
      type: Boolean,
      description: 'Filtrar roles institucionales o personalizados.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Búsqueda por código o nombre del rol.',
    }),
    ApiPaginatedResult(RoleReadModelResponseDto),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado para consultar roles.',
    }),
  );
}

export function ApiGetRole(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener un rol por su ID' }),
    ApiParam({
      name: 'id',
      format: 'uuid',
      description: 'ID del rol.',
    }),
    ApiOkResponse({
      type: RoleDetailReadModelResponseDto,
      description: 'Detalle del rol encontrado.',
    }),
    ApiNotFoundResponse({
      description: 'Rol no encontrado.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado para consultar roles.',
    }),
  );
}

export function ApiListRoleUsers(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Listar usuarios asignados a un rol' }),
    ApiParam({
      name: 'id',
      format: 'uuid',
      description: 'ID del rol.',
    }),
    ApiPaginatedResult(RoleUserReadModelResponseDto),
    ApiNotFoundResponse({
      description: 'Rol no encontrado.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado para consultar los usuarios asignados a un rol.',
    }),
  );
}
