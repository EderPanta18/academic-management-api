import { CourseOfferingStatus } from '@course-offerings/domain/entities';
import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiPaginatedResult } from '@shared/decorators';
import { CourseOfferingReadModelResponseDto } from '../dtos';

export function ApiListCourseOfferings() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar ofertas de curso con paginación' }),
    ApiQuery({
      name: 'courseId',
      required: false,
      type: String,
      format: 'uuid',
      description: 'Filtrar por ID del curso.',
    }),
    ApiQuery({
      name: 'academicPeriodId',
      required: false,
      type: String,
      format: 'uuid',
      description: 'Filtrar por ID del período académico.',
    }),
    ApiQuery({
      name: 'professorId',
      required: false,
      type: String,
      format: 'uuid',
      description: 'Filtrar por ID del profesor asignado.',
    }),
    ApiQuery({
      name: 'statuses',
      required: false,
      enum: CourseOfferingStatus,
      isArray: true,
      description: 'Filtrar por uno o más estados de la oferta.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Búsqueda global (código/nombre del curso, código del período, sección).',
    }),
    ApiPaginatedResult(CourseOfferingReadModelResponseDto),
  );
}

export function ApiGetCourseOfferingById() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener una oferta de curso por su ID' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID de la oferta de curso.',
      example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    }),
    ApiOkResponse({
      type: CourseOfferingReadModelResponseDto,
      description: 'Oferta de curso encontrada.',
    }),
    ApiNotFoundResponse({
      description: 'Oferta de curso no encontrada.',
    }),
  );
}
