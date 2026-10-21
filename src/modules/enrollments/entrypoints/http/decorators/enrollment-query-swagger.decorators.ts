import { EnrollmentStatus } from '@enrollments/domain/entities';
import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiPaginatedResult } from '@shared/decorators';
import { EnrollmentReadModelResponseDto, EnrollmentStatusLogReadModelResponseDto } from '../dtos';

export function ApiListEnrollments() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar inscripciones con paginación' }),
    ApiQuery({
      name: 'studentId',
      required: false,
      type: String,
      format: 'uuid',
      description: 'Filtrar por ID del estudiante.',
    }),
    ApiQuery({
      name: 'courseOfferingId',
      required: false,
      type: String,
      format: 'uuid',
      description: 'Filtrar por ID de la oferta de curso.',
    }),
    ApiQuery({
      name: 'academicPeriodId',
      required: false,
      type: String,
      format: 'uuid',
      description: 'Filtrar por ID del período académico.',
    }),
    ApiQuery({
      name: 'statuses',
      required: false,
      enum: EnrollmentStatus,
      isArray: true,
      description: 'Filtrar por uno o más estados de la inscripción.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Búsqueda global (código del estudiante, nombres, curso, período).',
    }),
    ApiPaginatedResult(EnrollmentReadModelResponseDto),
  );
}

export function ApiGetEnrollmentById() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener una inscripción por su ID' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID de la inscripción.',
      example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    }),
    ApiOkResponse({
      type: EnrollmentReadModelResponseDto,
      description: 'Inscripción encontrada.',
    }),
    ApiNotFoundResponse({
      description: 'Inscripción no encontrada.',
    }),
  );
}

export function ApiGetEnrollmentHistory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener el historial de cambios de estado de una inscripción',
    }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID de la inscripción.',
    }),
    ApiOkResponse({
      type: [EnrollmentStatusLogReadModelResponseDto],
      description: 'Historial de cambios de estado, ordenado cronológicamente.',
    }),
    ApiNotFoundResponse({
      description: 'Inscripción no encontrada.',
    }),
  );
}
