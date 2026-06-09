// core/pagination/pagination.vo.ts

import { PAGINATION_DEFAULTS, PAGINATION_LIMITS } from './pagination.constants';

export class PaginationVO {
  readonly page: number;
  readonly pageSize: number;

  constructor(page?: number, pageSize?: number) {
    this.page = page ?? PAGINATION_DEFAULTS.page;
    this.pageSize = pageSize ?? PAGINATION_DEFAULTS.pageSize;

    this.validate();

    Object.freeze(this);
  }

  private validate(): void {
    if (this.page < PAGINATION_LIMITS.minPage)
      throw new Error(`page debe ser mayor o igual a ${PAGINATION_LIMITS.minPage}`);

    if (this.pageSize < PAGINATION_LIMITS.minPageSize)
      throw new Error(`pageSize debe ser mayor o igual a ${PAGINATION_LIMITS.minPageSize}`);

    if (this.pageSize > PAGINATION_LIMITS.maxPageSize)
      throw new Error(`pageSize no puede superar ${PAGINATION_LIMITS.maxPageSize}`);
  }

  get offset(): number {
    return (this.page - 1) * this.pageSize;
  }
}
