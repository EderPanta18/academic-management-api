// shared/presentation/dtos/request/pagination-query.dto.ts

import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import {
  PAGINATION_LIMITS,
  PAGINATION_DEFAULTS,
} from '@shared/domain/constants';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(PAGINATION_LIMITS.MIN_PAGE, {
    message: `La página debe ser mayor o igual a ${PAGINATION_LIMITS.MIN_PAGE}`,
  })
  page?: number = PAGINATION_DEFAULTS.PAGE;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El tamaño de página debe ser un número entero' })
  @Min(PAGINATION_LIMITS.MIN_PAGE_SIZE, {
    message: `El tamaño de página debe ser al menos ${PAGINATION_LIMITS.MIN_PAGE_SIZE}`,
  })
  @Max(PAGINATION_LIMITS.MAX_PAGE_SIZE, {
    message: `El tamaño de página no puede superar los ${PAGINATION_LIMITS.MAX_PAGE_SIZE}`,
  })
  pageSize?: number = PAGINATION_DEFAULTS.PAGE_SIZE;
}
