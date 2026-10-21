import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { EnrollmentResponseDto, EnrollmentTransitionRequestDto } from '../dtos';

const TRANSITION_PARAM = {
  name: 'id',
  type: String,
  format: 'uuid',
  description: 'ID de la inscripción.',
} as const;

export function ApiConfirmEnrollment() {
  return applyDecorators(
    ApiOperation({ summary: 'Confirmar una inscripción (PENDING → ENROLLED)' }),
    ApiParam(TRANSITION_PARAM),
    ApiOkResponse({
      type: EnrollmentResponseDto,
      description: 'Inscripción confirmada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Inscripción no encontrada.',
    }),
    ApiConflictResponse({
      description: 'La inscripción no está en estado PENDING.',
    }),
  );
}

export function ApiCancelEnrollment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cancelar una inscripción (PENDING o ENROLLED → CANCELLED)',
    }),
    ApiParam(TRANSITION_PARAM),
    ApiBody({ type: EnrollmentTransitionRequestDto }),
    ApiOkResponse({
      type: EnrollmentResponseDto,
      description: 'Inscripción cancelada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Inscripción no encontrada.',
    }),
    ApiConflictResponse({
      description: 'La inscripción no está en estado PENDING o ENROLLED y no puede cancelarse.',
    }),
  );
}

export function ApiWithdrawEnrollment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retirar una inscripción (ENROLLED → WITHDRAWN)',
    }),
    ApiParam(TRANSITION_PARAM),
    ApiBody({ type: EnrollmentTransitionRequestDto }),
    ApiOkResponse({
      type: EnrollmentResponseDto,
      description: 'Inscripción retirada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Inscripción no encontrada.',
    }),
    ApiConflictResponse({
      description: 'La inscripción no está en estado ENROLLED y no puede retirarse.',
    }),
  );
}

export function ApiRejectEnrollment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Rechazar una inscripción (PENDING → REJECTED)',
    }),
    ApiParam(TRANSITION_PARAM),
    ApiBody({ type: EnrollmentTransitionRequestDto }),
    ApiOkResponse({
      type: EnrollmentResponseDto,
      description: 'Inscripción rechazada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Inscripción no encontrada.',
    }),
    ApiConflictResponse({
      description: 'La inscripción no está en estado PENDING y no puede rechazarse.',
    }),
  );
}

export function ApiFinishEnrollment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finalizar una inscripción (ENROLLED → FINISHED)',
    }),
    ApiParam(TRANSITION_PARAM),
    ApiBody({ type: EnrollmentTransitionRequestDto }),
    ApiOkResponse({
      type: EnrollmentResponseDto,
      description: 'Inscripción finalizada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Inscripción no encontrada.',
    }),
    ApiConflictResponse({
      description: 'La inscripción no está en estado ENROLLED y no puede finalizarse.',
    }),
  );
}
