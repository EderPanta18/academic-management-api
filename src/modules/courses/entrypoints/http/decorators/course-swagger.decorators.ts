import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CourseResponseDto, CreateCourseRequestDto } from '../dtos';

export function ApiCreateCourse() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar un nuevo curso en el catálogo' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateCourseRequestDto }),
    ApiCreatedResponse({
      type: CourseResponseDto,
      description: 'Curso creado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Programa académico o categoría no encontrados.',
    }),
    ApiConflictResponse({
      description: 'Ya existe un curso con ese código en el programa indicado.',
    }),
  );
}
