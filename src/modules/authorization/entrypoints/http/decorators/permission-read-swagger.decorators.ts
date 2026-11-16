// src/modules/authorization/entrypoints/http/decorators/permission-read-swagger.decorators.ts

import { applyDecorators } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';

export function ApiListPermissions(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Listar permisos con paginación' }),
    ApiQuery({
      name: 'module',
      required: false,
      type: String,
      description: 'Filtrar permisos por módulo funcional.',
    }),
    ApiQuery({
      name: 'isReserved',
      required: false,
      type: Boolean,
      description: 'Filtrar permisos reservados u ordinarios.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Búsqueda por código o nombre del permiso.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado para consultar permisos.',
    }),
  );
}
