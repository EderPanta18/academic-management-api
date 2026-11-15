// src/modules/authorization/entrypoints/http/decorators/role-grant-swagger.decorators.ts

import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { GrantRoleRequestDto } from '../dtos';

export function ApiGrantRole(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Asignar un rol a una cuenta' }),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiParam({
      name: 'userId',
      format: 'uuid',
      description: 'ID de la cuenta que recibirá el rol.',
    }),
    ApiBody({ type: GrantRoleRequestDto }),
    ApiNoContentResponse({
      description: 'Rol asignado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'La cuenta o el rol no existe.',
    }),
    ApiConflictResponse({
      description: 'El rol ya está asignado a la cuenta.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado para realizar esta asignación.',
    }),
  );
}

export function ApiRevokeRole(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Revocar un rol asignado a una cuenta' }),
    HttpCode(HttpStatus.NO_CONTENT),
    ApiParam({
      name: 'userId',
      format: 'uuid',
      description: 'ID de la cuenta.',
    }),
    ApiParam({
      name: 'roleId',
      format: 'uuid',
      description: 'ID del rol que se revocará.',
    }),
    ApiNoContentResponse({
      description: 'Rol revocado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'El rol no existe.',
    }),
    ApiConflictResponse({
      description: 'El rol no está asignado a la cuenta.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado para revocar esta asignación.',
    }),
  );
}
