import { AcademicPeriodStatus } from '@academic-periods/domain/entities';
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
import {
  AcademicPeriodReadModelResponseDto,
  AcademicPeriodResponseDto,
  CreateAcademicPeriodRequestDto,
} from '../dtos';

export function ApiListAcademicPeriods() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar periodos académicos con paginación' }),
    ApiQuery({
      name: 'status',
      required: false,
      enum: AcademicPeriodStatus,
      description: 'Filtrar por estado del periodo.',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Búsqueda global (código, nombre).',
    }),
    ApiPaginatedResult(AcademicPeriodReadModelResponseDto),
  );
}

export function ApiGetAcademicPeriodById() {
  return applyDecorators(
    ApiOperation({ summary: 'Obtener un periodo académico por su ID' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID del periodo académico.',
      example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
    }),
    ApiOkResponse({
      type: AcademicPeriodReadModelResponseDto,
      description: 'Periodo académico encontrado.',
    }),
    ApiNotFoundResponse({
      description: 'Periodo académico no encontrado.',
    }),
  );
}

export function ApiCreateAcademicPeriod() {
  return applyDecorators(
    ApiOperation({ summary: 'Registrar un nuevo periodo académico' }),
    HttpCode(HttpStatus.CREATED),
    ApiBody({ type: CreateAcademicPeriodRequestDto }),
    ApiCreatedResponse({
      type: AcademicPeriodResponseDto,
      description: 'Periodo académico creado correctamente.',
    }),
    ApiConflictResponse({
      description: 'Ya existe un periodo académico con ese código.',
    }),
  );
}

export function ApiOpenAcademicPeriod() {
  return applyDecorators(
    ApiOperation({ summary: 'Abrir un periodo académico (PLANNED → OPEN)' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID del periodo académico.',
    }),
    ApiOkResponse({
      type: AcademicPeriodResponseDto,
      description: 'Periodo académico abierto correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Periodo académico no encontrado.',
    }),
    ApiConflictResponse({
      description: 'El periodo no está en estado PLANNED y no puede abrirse.',
    }),
  );
}

export function ApiStartAcademicPeriod() {
  return applyDecorators(
    ApiOperation({ summary: 'Iniciar un periodo académico (OPEN → IN_PROGRESS)' }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID del periodo académico.',
    }),
    ApiOkResponse({
      type: AcademicPeriodResponseDto,
      description: 'Periodo académico iniciado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Periodo académico no encontrado.',
    }),
    ApiConflictResponse({
      description: 'El periodo no está en estado OPEN y no puede iniciarse.',
    }),
  );
}

export function ApiCloseAcademicPeriod() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cerrar un periodo académico (OPEN o IN_PROGRESS → CLOSED)',
    }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID del periodo académico.',
    }),
    ApiOkResponse({
      type: AcademicPeriodResponseDto,
      description: 'Periodo académico cerrado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Periodo académico no encontrado.',
    }),
    ApiConflictResponse({
      description: 'El periodo no está en estado OPEN o IN_PROGRESS y no puede cerrarse.',
    }),
  );
}

export function ApiCancelAcademicPeriod() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cancelar un periodo académico (PLANNED, OPEN o IN_PROGRESS → CANCELLED)',
    }),
    ApiParam({
      name: 'id',
      type: String,
      format: 'uuid',
      description: 'ID del periodo académico.',
    }),
    ApiOkResponse({
      type: AcademicPeriodResponseDto,
      description: 'Periodo académico cancelado correctamente.',
    }),
    ApiNotFoundResponse({
      description: 'Periodo académico no encontrado.',
    }),
    ApiConflictResponse({
      description:
        'El periodo ya está en un estado terminal (CLOSED o CANCELLED) y no puede cancelarse.',
    }),
  );
}
