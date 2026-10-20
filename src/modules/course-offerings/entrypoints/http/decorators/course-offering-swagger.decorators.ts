import { CourseOfferingStatus } from '@course-offerings/domain/entities';
import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiPaginatedResult } from '@shared/decorators';
import {
  AssignProfessorRequestDto,
  CourseOfferingReadModelResponseDto,
  CourseOfferingResponseDto,
  CreateCourseOfferingRequestDto,
} from '../dtos';

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

export function ApiCreateCourseOffering() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar una nueva oferta de curso' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateCourseOfferingRequestDto }),
    ApiCreatedResponse({
      type: CourseOfferingResponseDto,
      description: 'Oferta de curso creada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Curso, período académico o profesor no encontrados.',
    }),
    ApiConflictResponse({
      description:
        'El período académico no está abierto / ' +
        'El profesor no está activo / ' +
        'Ya existe una oferta con esa sección en el mismo curso y período.',
    }),
  );
}

export function ApiAssignProfessorToOffering() {
  return applyDecorators(
    ApiOperation({
      summary: 'Asignar un profesor a una oferta de curso (DRAFT u OPEN)',
    }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID de la oferta de curso.',
    }),
    ApiBody({ type: AssignProfessorRequestDto }),
    ApiOkResponse({
      type: CourseOfferingResponseDto,
      description: 'Profesor asignado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Oferta de curso o profesor no encontrados.',
    }),
    ApiConflictResponse({
      description:
        'La oferta no está en un estado que permita asignación / ' + 'El profesor no está activo.',
    }),
  );
}

export function ApiOpenCourseOffering() {
  return applyDecorators(
    ApiOperation({ summary: 'Abrir una oferta de curso (DRAFT → OPEN)' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID de la oferta de curso.',
    }),
    ApiOkResponse({
      type: CourseOfferingResponseDto,
      description: 'Oferta de curso abierta correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Oferta de curso no encontrada.',
    }),
    ApiConflictResponse({
      description:
        'La oferta no está en estado DRAFT / ' + 'La oferta no tiene un profesor asignado.',
    }),
  );
}

export function ApiCloseCourseOffering() {
  return applyDecorators(
    ApiOperation({ summary: 'Cerrar una oferta de curso (OPEN → CLOSED)' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID de la oferta de curso.',
    }),
    ApiOkResponse({
      type: CourseOfferingResponseDto,
      description: 'Oferta de curso cerrada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Oferta de curso no encontrada.',
    }),
    ApiConflictResponse({
      description: 'La oferta no está en estado OPEN.',
    }),
  );
}

export function ApiFinishCourseOffering() {
  return applyDecorators(
    ApiOperation({ summary: 'Finalizar una oferta de curso (CLOSED → FINISHED)' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID de la oferta de curso.',
    }),
    ApiOkResponse({
      type: CourseOfferingResponseDto,
      description: 'Oferta de curso finalizada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Oferta de curso no encontrada.',
    }),
    ApiConflictResponse({
      description: 'La oferta no está en estado CLOSED.',
    }),
  );
}

export function ApiCancelCourseOffering() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cancelar una oferta de curso (DRAFT, OPEN o CLOSED → CANCELLED)',
    }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID de la oferta de curso.',
    }),
    ApiOkResponse({
      type: CourseOfferingResponseDto,
      description: 'Oferta de curso cancelada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Oferta de curso no encontrada.',
    }),
    ApiConflictResponse({
      description:
        'La oferta está en un estado terminal (CANCELLED o FINISHED) y no puede cancelarse.',
    }),
  );
}
