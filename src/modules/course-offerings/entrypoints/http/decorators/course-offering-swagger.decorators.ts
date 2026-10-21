import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CourseOfferingResponseDto, CreateCourseOfferingRequestDto } from '../dtos';

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
