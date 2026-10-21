import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { AcademicPeriodResponseDto } from '../dtos';

const TRANSITION_PARAM = {
  name: 'id',
  type: String,
  format: 'uuid',
  description: 'ID del periodo académico.',
} as const;

export function ApiOpenAcademicPeriod() {
  return applyDecorators(
    ApiOperation({ summary: 'Abrir un periodo académico (PLANNED → OPEN)' }),
    ApiParam(TRANSITION_PARAM),
    ApiOkResponse({
      type: AcademicPeriodResponseDto,
      description: 'Periodo académico abierto correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Periodo académico no encontrado.',
    }),
    ApiConflictResponse({
      description: 'El periodo no está en estado PLANNED y no puede abrirse.',
    }),
  );
}

export function ApiStartAcademicPeriod() {
  return applyDecorators(
    ApiOperation({ summary: 'Iniciar un periodo académico (OPEN → IN_PROGRESS)' }),
    ApiParam(TRANSITION_PARAM),
    ApiOkResponse({
      type: AcademicPeriodResponseDto,
      description: 'Periodo académico iniciado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Periodo académico no encontrado.',
    }),
    ApiConflictResponse({
      description: 'El periodo no está en estado OPEN y no puede iniciarse.',
    }),
  );
}

export function ApiCloseAcademicPeriod() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cerrar un periodo académico (OPEN o IN_PROGRESS → CLOSED)',
    }),
    ApiParam(TRANSITION_PARAM),
    ApiOkResponse({
      type: AcademicPeriodResponseDto,
      description: 'Periodo académico cerrado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Periodo académico no encontrado.',
    }),
    ApiConflictResponse({
      description: 'El periodo no está en estado OPEN o IN_PROGRESS y no puede cerrarse.',
    }),
  );
}

export function ApiCancelAcademicPeriod() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cancelar un periodo académico (PLANNED, OPEN o IN_PROGRESS → CANCELLED)',
    }),
    ApiParam(TRANSITION_PARAM),
    ApiOkResponse({
      type: AcademicPeriodResponseDto,
      description: 'Periodo académico cancelado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Periodo académico no encontrado.',
    }),
    ApiConflictResponse({
      description:
        'El periodo ya está en un estado terminal (CLOSED o CANCELLED) y no puede cancelarse.',
    }),
  );
}
