import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateProfessorRequestDto, ProfessorResponseDto } from '../dtos';

export function ApiCreateProfessor() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar un nuevo profesor' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateProfessorRequestDto }),
    ApiCreatedResponse({
      type: ProfessorResponseDto,
      description: 'Profesor creado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Tipo de documento no encontrado.',
    }),
    ApiConflictResponse({
      description: 'El código, documento o email ya están registrados.',
    }),
  );
}
