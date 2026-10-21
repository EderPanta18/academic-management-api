import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiPaginatedResult } from '@shared/decorators';
import { StudentImportStatus } from '@students/domain/entities';
import { StudentImportReadModelResponseDto } from '../dtos';

export function ApiListStudentImports() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar historial de importaciones con paginación' }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: StudentImportStatus,
      description: 'Filtrar por estado de la importación',
    }),
    ApiQuery({
      name: 'createdByUserId',
      required: false,
      type: String,
      format: 'uuid',
      description: 'Filtrar por ID del usuario creador',
    }),
    ApiPaginatedResult(StudentImportReadModelResponseDto),
  );
}

export function ApiGetStudentImportById() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener estado de importación por ID' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID de la importación',
      example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    }),
    ApiOkResponse({
      type: StudentImportReadModelResponseDto,
      description: 'Detalle del estado de la importación.',
    }),
    ApiNotFoundResponse({
      description: 'Importación no encontrada.',
    }),
  );
}
