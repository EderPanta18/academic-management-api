// src/core/pagination/paginated-result.ts

import { ValidationException } from '@core/exceptions';
import type { PaginationVO } from './pagination.vo';

export type PaginatedResult<TItem> = {
  items: TItem[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export function createPaginatedResult<TItem>(
  items: TItem[],
  pagination: PaginationVO,
  totalItems: number,
): PaginatedResult<TItem> {
  if (!Number.isSafeInteger(totalItems) || totalItems < 0)
    throw new ValidationException('El total de elementos no es válido.', [
      {
        field: 'totalItems',
        messages: ['totalItems debe ser un entero seguro mayor o igual a cero.'],
      },
    ]);

  const { page, limit } = pagination;

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    meta: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
