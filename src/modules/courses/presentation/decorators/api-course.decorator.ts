// modules/courses/presentation/decorators/api-course.decorator.ts

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
import { CreateCourseDto, CourseResponseDto } from '../dtos';
import { ApiPaginatedOperation } from '@shared/presentation/decorators';

export const ApiCreateCourse = () =>
  applyDecorators(
    ApiOperation({ summary: 'Registrar un nuevo curso en el catálogo' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateCourseDto }),
    ApiCreatedResponse({
      type: CourseResponseDto,
      description: 'Curso creado correctamente',
    }),
    ApiNotFoundResponse({
      description: 'La carrera o categoría especificada no existe',
    }),
    ApiConflictResponse({
      description: 'Ya existe un curso con ese nombre en la carrera indicada',
    }),
  );

export const ApiListCourses = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar cursos del catálogo con paginación' }),
    ApiQuery({
      name: 'careerId',
      required: false,
      type: Number,
      example: 1,
      description: 'Filtrar por id de carrera',
    }),
    ApiQuery({
      name: 'categoryId',
      required: false,
      type: Number,
      example: 2,
      description: 'Filtrar por id de categoría',
    }),
    ApiPaginatedOperation(CourseResponseDto),
  );

export const ApiGetCourseById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener un curso por id' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Id del curso',
      example: 1,
    }),
    ApiOkResponse({
      type: CourseResponseDto,
      description: 'Curso encontrado',
    }),
    ApiNotFoundResponse({ description: 'Curso no encontrado' }),
  );
