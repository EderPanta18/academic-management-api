import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProfessorStatus } from '@professors/domain/entities';
import { ApiPaginatedResult } from '@shared/decorators';
import { ProfessorReadModelResponseDto } from '../dtos';

export function ApiListProfessors() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar profesores con paginación' }),
    ApiQuery({
      name: 'department',
      required: false,
      type: String,
      description: 'Filtrar por departamento.',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: ProfessorStatus,
      description: 'Filtrar por estado.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Búsqueda global (código, documento, nombre, email).',
    }),
    ApiPaginatedResult(ProfessorReadModelResponseDto),
  );
}

export function ApiGetProfessorById() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener un profesor por su ID' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID del profesor.',
      example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    }),
    ApiOkResponse({
      type: ProfessorReadModelResponseDto,
      description: 'Profesor encontrado.',
    }),
    ApiNotFoundResponse({
      description: 'Profesor no encontrado.',
    }),
  );
}
