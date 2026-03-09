// modules/enrollments/presentation/decorators/api-enrollment.decorator.ts

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
import { ApiPaginatedOperation } from '@shared/presentation/decorators';
import { EnrollmentStatus } from '@enrollments/domain/constants';
import { EnrollmentResponseDto, EnrollStudentDto } from '../dtos';

export const ApiEnrollStudent = () =>
  applyDecorators(
    ApiOperation({ summary: 'Inscribir alumno a una oferta de curso' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: EnrollStudentDto }),
    ApiCreatedResponse({
      type: EnrollmentResponseDto,
      description: 'Alumno inscrito correctamente',
    }),
    ApiNotFoundResponse({
      description: 'Alumno u oferta de curso no encontrado',
    }),
    ApiConflictResponse({
      description: 'El alumno ya está inscrito en esa oferta',
    }),
    ApiUnprocessableEntityResponse({
      description:
        'Alumno inactivo / oferta cerrada / carrera no coincide / capacidad máxima alcanzada',
    }),
  );

export const ApiGetEnrollmentById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener inscripción por id' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Id de la inscripción',
      example: 1,
    }),
    ApiOkResponse({
      type: EnrollmentResponseDto,
      description: 'Inscripción encontrada',
    }),
    ApiNotFoundResponse({ description: 'Inscripción no encontrada' }),
  );

export const ApiListEnrollments = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar inscripciones con paginación y filtros' }),
    ApiQuery({
      name: 'studentId',
      required: false,
      type: Number,
      description: 'Filtrar por alumno',
    }),
    ApiQuery({
      name: 'courseOfferingId',
      required: false,
      type: Number,
      description: 'Filtrar por oferta',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      isArray: true,
      enum: EnrollmentStatus,
      description: 'Filtrar por estado(s)',
    }),
    ApiPaginatedOperation(EnrollmentResponseDto),
  );
