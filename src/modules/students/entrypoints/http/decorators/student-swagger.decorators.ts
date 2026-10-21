import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateStudentRequestDto, StudentResponseDto } from '../dtos';

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
