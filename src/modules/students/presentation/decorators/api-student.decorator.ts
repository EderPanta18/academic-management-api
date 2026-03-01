// modules/students/presentation/decorators/api-student.decorator.ts

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
import { CreateStudentDto, StudentResponseDto } from '../dtos';

export const ApiCreateStudent = () =>
  applyDecorators(
    ApiOperation({ summary: 'Registrar un nuevo estudiante' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateStudentDto }),
    ApiCreatedResponse({
      type: StudentResponseDto,
      description: 'Estudiante creado correctamente',
    }),
    ApiNotFoundResponse({ description: 'Carrera no encontrada' }),
    ApiConflictResponse({
      description: 'El código, DNI o email ya están registrados',
    }),
  );

export const ApiListStudents = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar estudiantes con paginación' }),
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
      name: 'careerId',
      required: false,
      type: Number,
      example: 1,
      description: 'Filtrar por id de carrera',
    }),
    ApiOkResponse({ description: 'Listado paginado de estudiantes' }),
  );

export const ApiGetStudentById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener un estudiante por id' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Id del estudiante',
      example: 1,
    }),
    ApiOkResponse({
      type: StudentResponseDto,
      description: 'Estudiante encontrado',
    }),
    ApiNotFoundResponse({ description: 'Estudiante no encontrado' }),
  );
