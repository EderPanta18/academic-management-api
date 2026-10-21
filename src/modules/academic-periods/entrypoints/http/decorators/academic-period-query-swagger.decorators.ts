import { AcademicPeriodStatus } from '@academic-periods/domain/entities';
import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApiPaginatedResult } from '@shared/decorators';
import { AcademicPeriodReadModelResponseDto } from '../dtos';

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
