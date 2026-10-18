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
import { StudentStatus } from '@students/domain/entities';
import { CreateStudentRequestDto, StudentReadModelResponseDto, StudentResponseDto } from '../dtos';

export function ApiListStudents() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar estudiantes con paginación' }),
    ApiQuery({
      name: 'academicProgramId',
      required: false,
      type: String,
      description: 'Filtrar por ID del programa académico.',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: StudentStatus,
      description: 'Filtrar por estado académico.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Búsqueda global (código, documento, nombre, email).',
    }),
    ApiPaginatedResult(StudentReadModelResponseDto),
  );
}

export function ApiGetStudentById() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener un estudiante por su ID' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID del estudiante.',
      example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    }),
    ApiOkResponse({
      type: StudentReadModelResponseDto,
      description: 'Estudiante encontrado.',
    }),
    ApiNotFoundResponse({
      description: 'Estudiante no encontrado.',
    }),
  );
}

export function ApiCreateStudent() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar un nuevo estudiante' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateStudentRequestDto }),
    ApiCreatedResponse({
      type: StudentResponseDto,
      description: 'Estudiante creado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Programa académico o tipo de documento no encontrado.',
    }),
    ApiConflictResponse({
      description: 'El código, documento o email ya están registrados.',
    }),
  );
}
