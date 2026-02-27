// modules/course-offerings/presentation/decorators/api-course-offering.decorator.ts

import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
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
    ApiBadRequestResponse({ description: 'Datos de entrada inválidos' }),
    ApiConflictResponse({
      description:
        'Ya existe una oferta para esa combinación de curso, período y sección',
    }),
    ApiNotFoundResponse({
      description: 'Curso o período académico no encontrado',
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
      name: 'status',
      required: false,
      enum: CourseOfferingStatus,
      description: 'Filtrar por estado de la oferta',
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
  );
