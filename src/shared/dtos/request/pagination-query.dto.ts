import { PAGINATION_LIMIT, PAGINATION_PAGE } from '@core/pagination';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Número de página.',
    default: PAGINATION_PAGE.default,
    example: PAGINATION_PAGE.default,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(PAGINATION_PAGE.range.min, {
    message: `La página debe ser mayor o igual a ${PAGINATION_PAGE.range.min}`,
  })
  page: number = PAGINATION_PAGE.default;

  @ApiPropertyOptional({
    description: 'Cantidad de registros por página.',
    default: PAGINATION_LIMIT.default,
    example: PAGINATION_LIMIT.default,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El tamaño de página debe ser un número entero' })
  @Min(PAGINATION_LIMIT.range.min, {
    message: `El tamaño de página debe ser al menos ${PAGINATION_LIMIT.range.min}`,
  })
  @Max(PAGINATION_LIMIT.range.max, {
    message: `El tamaño de página no puede superar los ${PAGINATION_LIMIT.range.max}`,
  })
  limit: number = PAGINATION_LIMIT.default;
}
