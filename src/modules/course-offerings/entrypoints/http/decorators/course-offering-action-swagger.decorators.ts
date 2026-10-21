import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AssignProfessorRequestDto, CourseOfferingResponseDto } from '../dtos';

const ACTION_PARAM = {
  name: 'id',
  type: String,
  format: 'uuid',
  description: 'ID de la oferta de curso.',
} as const;

export function ApiAssignProfessorToOffering() {
  return applyDecorators(
    ApiOperation({
      summary: 'Asignar un profesor a una oferta de curso (DRAFT u OPEN)',
    }),
    ApiParam(ACTION_PARAM),
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
    ApiParam(ACTION_PARAM),
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
    ApiParam(ACTION_PARAM),
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
    ApiParam(ACTION_PARAM),
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
    ApiParam(ACTION_PARAM),
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
