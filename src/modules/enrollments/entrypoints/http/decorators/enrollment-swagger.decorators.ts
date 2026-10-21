import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { EnrollmentResponseDto, EnrollStudentRequestDto } from '../dtos';

export function ApiEnrollStudent() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar una nueva inscripción' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: EnrollStudentRequestDto }),
    ApiCreatedResponse({
      type: EnrollmentResponseDto,
      description: 'Inscripción registrada correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Estudiante u oferta de curso no encontrados.',
    }),
    ApiConflictResponse({
      description:
        'El estudiante ya está inscrito en esa oferta / ' +
        'El estudiante no está activo / ' +
        'La oferta no está abierta / ' +
        'El estudiante no pertenece al programa académico del curso / ' +
        'La oferta alcanzó su cupo máximo.',
    }),
  );
}
