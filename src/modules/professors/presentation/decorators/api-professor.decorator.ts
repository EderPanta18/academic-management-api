// modules/professors/presentation/decorators/api-professor.decorator.ts

import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CreateProfessorDto, ProfessorResponseDto } from '../dtos';

export const ApiCreateProfessor = () =>
  applyDecorators(
    ApiOperation({ summary: 'Registrar un nuevo profesor' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateProfessorDto }),
    ApiCreatedResponse({
      type: ProfessorResponseDto,
      description: 'Profesor creado correctamente',
    }),
    ApiBadRequestResponse({ description: 'Datos de entrada inválidos' }),
    ApiConflictResponse({ description: 'El DNI o email ya están registrados' }),
  );

export const ApiListProfessors = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar profesores activos con paginación' }),
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

    ApiOkResponse({ description: 'Listado paginado de profesores' }),
  );

export const ApiGetProfessorById = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obtener un profesor por id' }),
    ApiParam({
      name: 'id',
      type: Number,
      description: 'Id del profesor',
      example: 1,
    }),
    ApiOkResponse({
      type: ProfessorResponseDto,
      description: 'Profesor encontrado',
    }),
    ApiNotFoundResponse({ description: 'Profesor no encontrado' }),
  );
