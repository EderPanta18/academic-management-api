// modules/course-offerings/presentation/decorators/api-course-offering.decorator.ts

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
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CourseOfferingStatus } from '@modules/course-offerings/domain/constants';
import {
  AssignProfessorDto,
  CourseOfferingResponseDto,
  CreateCourseOfferingDto,
} from '../dtos';

export const ApiCreateCourseOffering = () =>
  applyDecorators(
    ApiOperation({ summary: 'Crear una nueva oferta de curso' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateCourseOfferingDto }),
    ApiCreatedResponse({
      type: CourseOfferingResponseDto,
      description: 'Oferta creada correctamente',
    }),
    ApiNotFoundResponse({
      description: 'Curso, período académico o profesor no encontrado',
    }),
    ApiUnprocessableEntityResponse({
      description:
        'El período académico no es el vigente / ' +
        'El profesor no tiene estado ACTIVE',
    }),
    ApiConflictResponse({
      description:
        'Ya existe una oferta para esa combinación de curso, período y sección',
    }),
  );

export const ApiListCourseOfferings = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar ofertas de curso con paginación' }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Número de página',
    }),
    ApiQuery({
      name: 'pageSize',
      required: false,
      type: Number,
      example: 20,
      description: 'Registros por página (máx. 100)',
    }),
    ApiQuery({
      name: 'courseId',
      required: false,
      type: Number,
      example: 1,
      description: 'Filtrar por id de curso',
    }),
    ApiQuery({
      name: 'academicPeriodId',
      required: false,
      type: Number,
      example: 1,
      description: 'Filtrar por id de período académico',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: CourseOfferingStatus,
      isArray: true,
      description: 'Filtrar por estado(s) de la oferta',
    }),
    ApiOkResponse({ description: 'Listado paginado de ofertas de curso' }),
  );

export const ApiGetCourseOfferingById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener una oferta de curso por id' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Id de la oferta de curso',
      example: 1,
    }),
    ApiOkResponse({
      type: CourseOfferingResponseDto,
      description: 'Oferta encontrada',
    }),
    ApiNotFoundResponse({ description: 'Oferta no encontrada' }),
  );

export const ApiAssignProfessorToOffering = () =>
  applyDecorators(
    ApiOperation({ summary: 'Asignar profesor a una oferta de curso' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Id de la oferta de curso',
      example: 1,
    }),
    ApiBody({ type: AssignProfessorDto }),
    ApiOkResponse({
      type: CourseOfferingResponseDto,
      description: 'Profesor asignado correctamente',
    }),
    ApiNotFoundResponse({ description: 'Oferta o profesor no encontrado' }),
    ApiUnprocessableEntityResponse({
      description:
        'La oferta está en estado CANCELLED o COMPLETED / ' +
        'El profesor no tiene estado ACTIVE',
    }),
  );

export const ApiActivateCourseOffering = () =>
  applyDecorators(
    ApiOperation({ summary: 'Activar oferta de curso (INACTIVE → ACTIVE)' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Id de la oferta de curso',
      example: 1,
    }),
    ApiOkResponse({
      type: CourseOfferingResponseDto,
      description: 'Oferta activada correctamente',
    }),
    ApiNotFoundResponse({ description: 'Oferta no encontrada' }),
    ApiUnprocessableEntityResponse({
      description:
        'La oferta no está en estado INACTIVE / ' +
        'La oferta no tiene profesor asignado',
    }),
  );
