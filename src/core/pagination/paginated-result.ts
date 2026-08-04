// src/core/pagination/paginated-result.ts

import type { PaginationVO } from './pagination.vo';

export type PaginatedResult<TItem> = {
  data: TItem[];
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
  data: TItem[],
  pagination: PaginationVO,
  totalItems: number,
): PaginatedResult<TItem> {
  const { page, limit, offset } = pagination;

  const totalPages = Math.ceil(totalItems / limit);

  const hasNextPage = offset + limit < totalItems;
  const hasPreviousPage = page > 1;

  return {
    data,
    meta: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
  };
}
