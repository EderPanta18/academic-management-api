// src/shared/dtos/request/pagination-query.dto.ts

import { PAGINATION_LIMIT, PAGINATION_PAGE } from '@core/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Max, Min, ValidateIf } from 'class-validator';

function parsePositiveInteger(value: unknown): unknown {
  if (typeof value !== 'string') return value;

  if (!/^[0-9]+$/.test(value)) return value;

  const parsed = Number(value);

  return Number.isSafeInteger(parsed) ? parsed : value;
}

export class PaginationQueryDto {
  @ApiPropertyOptional({
    type: 'integer',
    minimum: PAGINATION_PAGE.range.min,
    default: PAGINATION_PAGE.default,
    description: 'Número de página.',
    example: PAGINATION_PAGE.default,
  })
  @ValidateIf((_, value: unknown) => value !== undefined)
  @Transform(({ value }) => parsePositiveInteger(value))
  @IsInt({ message: 'La página debe ser un número entero.' })
  @Min(PAGINATION_PAGE.range.min, {
    message: `La página debe ser mayor o igual a ${PAGINATION_PAGE.range.min}.`,
  })
  @Max(Number.MAX_SAFE_INTEGER, {
    message: 'La página supera el rango numérico seguro.',
  })
  page?: number;

  @ApiPropertyOptional({
    type: 'integer',
    minimum: PAGINATION_LIMIT.range.min,
    maximum: PAGINATION_LIMIT.range.max,
    default: PAGINATION_LIMIT.default,
    description: 'Cantidad de registros por página.',
    example: PAGINATION_LIMIT.default,
  })
  @ValidateIf((_, value: unknown) => value !== undefined)
  @Transform(({ value }) => parsePositiveInteger(value))
  @IsInt({ message: 'El tamaño de página debe ser un número entero.' })
  @Min(PAGINATION_LIMIT.range.min, {
    message: `El tamaño de página debe ser al menos ${PAGINATION_LIMIT.range.min}.`,
  })
  @Max(PAGINATION_LIMIT.range.max, {
    message: `El tamaño de página no puede superar ${PAGINATION_LIMIT.range.max}.`,
  })
  limit?: number;
}
