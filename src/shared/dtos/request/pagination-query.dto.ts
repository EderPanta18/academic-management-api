// shared/dtos/request/pagination-query.dto.ts

import { PAGINATION_DEFAULTS, PAGINATION_LIMITS } from '@core/pagination';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(PAGINATION_LIMITS.minPage, {
    message: `La página debe ser mayor o igual a ${PAGINATION_LIMITS.minPage}`,
  })
  page: number = PAGINATION_DEFAULTS.page;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El tamaño de página debe ser un número entero' })
  @Min(PAGINATION_LIMITS.minPageSize, {
    message: `El tamaño de página debe ser al menos ${PAGINATION_LIMITS.minPageSize}`,
  })
  @Max(PAGINATION_LIMITS.maxPageSize, {
    message: `El tamaño de página no puede superar los ${PAGINATION_LIMITS.maxPageSize}`,
  })
  pageSize: number = PAGINATION_DEFAULTS.pageSize;
}
