// src/modules/persons/entrypoints/http/decorators/person-read-swagger.decorators.ts

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
import { PersonReadModelResponseDto } from '../dtos';

export function ApiListPersons(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Listar personas con paginación' }),
    ApiQuery({
      name: 'documentTypeId',
      required: false,
      type: String,
      format: 'uuid',
      description: 'Filtrar personas por tipo de documento.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Búsqueda por documento, nombres, apellidos o correo electrónico.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado para consultar personas.',
    }),
    ApiPaginatedResult(PersonReadModelResponseDto),
  );
}

export function ApiGetPerson(): MethodDecorator {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener una persona por su ID' }),
    ApiParam({
      name: 'id',
      format: 'uuid',
      description: 'ID de la persona.',
    }),
    ApiOkResponse({
      type: PersonReadModelResponseDto,
      description: 'Detalle de la persona encontrada.',
    }),
    ApiNotFoundResponse({
      description: 'Persona no encontrada.',
    }),
    ApiForbiddenResponse({
      description: 'El usuario no está autorizado para consultar personas.',
    }),
  );
}
