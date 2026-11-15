// src/modules/authorization/entrypoints/http/decorators/role-swagger.decorators.ts

import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { CreateRoleRequestDto, RoleResponseDto, UpdateRoleRequestDto } from '../dtos';

export function ApiCreateRole(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar un nuevo rol personalizado' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateRoleRequestDto }),
    ApiCreatedResponse({
      type: RoleResponseDto,
      description: 'Rol creado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Uno o más permisos no existen.',
    }),
    ApiConflictResponse({
      description: 'El código del rol ya está registrado.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado o intenta asignar permisos reservados.',
    }),
  );
}

export function ApiUpdateRole(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Actualizar un rol personalizado' }),
    ApiParam({
      name: 'id',
      format: 'uuid',
      description: 'ID del rol que se actualizará.',
    }),
    ApiBody({ type: UpdateRoleRequestDto }),
    ApiOkResponse({
      type: RoleResponseDto,
      description: 'Rol actualizado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'El rol o alguno de los permisos no existe.',
    }),
    ApiForbiddenResponse({
      description: 'Operación no autorizada o modificación de un rol institucional.',
    }),
  );
}
