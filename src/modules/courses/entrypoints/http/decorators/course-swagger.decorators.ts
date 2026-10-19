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
import { CourseReadModelResponseDto, CourseResponseDto, CreateCourseRequestDto } from '../dtos';

export function ApiListCourses() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar cursos del catálogo con paginación' }),
    ApiQuery({
      name: 'academicProgramId',
      required: false,
      type: String,
      format: 'uuid',
      description: 'Filtrar por ID del programa académico.',
    }),
    ApiQuery({
      name: 'courseCategoryId',
      required: false,
      type: String,
      format: 'uuid',
      description: 'Filtrar por ID de la categoría de curso.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Búsqueda global (código, nombre).',
    }),
    ApiPaginatedResult(CourseReadModelResponseDto),
  );
}

export function ApiGetCourseById() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener un curso por su ID' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID del curso.',
      example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    }),
    ApiOkResponse({
      type: CourseReadModelResponseDto,
      description: 'Curso encontrado.',
    }),
    ApiNotFoundResponse({
      description: 'Curso no encontrado.',
    }),
  );
}

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
