// core/pagination/paginated-result.dto.ts

import type { PaginationVO } from './pagination.vo';

export class PaginatedResultDto<T> {
  readonly items: T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly hasNextPage: boolean;

  private constructor(items: T[], total: number, pagination: PaginationVO) {
    this.items = items;
    this.total = total;
    this.page = pagination.page;
    this.pageSize = pagination.pageSize;
    this.hasNextPage = pagination.offset + pagination.pageSize < total;
  }

  static from<T>(items: T[], total: number, pagination: PaginationVO): PaginatedResultDto<T> {
    return new PaginatedResultDto(items, total, pagination);
  }
}
