// modules/students/presentation/decorators/api-student.decorator.ts

import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { ApiPaginatedOperation } from '@shared/decorators';
import { STUDENT_BULK_IMPORT } from '@students/presentation/constants';
import { BulkImportResultResponseDto, CreateStudentDto, StudentResponseDto } from '../dtos';

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
      name: 'careerId',
      required: false,
      type: Number,
      example: 1,
      description: 'Filtrar por id de carrera',
    }),
    ApiPaginatedOperation(StudentResponseDto),
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

export const ApiBulkImportStudents = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Importar estudiantes desde archivo .xlsx o .csv',
      description:
        '**Columnas requeridas:** `nombres`, `apellidos`, `dni`, `email`, ' +
        '`codigo`, `carreraId`, `fechaMatricula` (YYYY-MM-DD)\n\n' +
        '**Columnas opcionales:** `emailInstitucional`, `telefono`, `fechaNacimiento`\n\n' +
        `Máximo **${STUDENT_BULK_IMPORT.MAX_ROWS} filas** · máx. **${STUDENT_BULK_IMPORT.MAX_FILE_SIZE_MB} MB**\n\n`,
    }),
    HttpCode(HttpStatus.OK),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Archivo .xlsx o .csv',
          },
        },
      },
    }),
    ApiOkResponse({ type: BulkImportResultResponseDto }),
  );
