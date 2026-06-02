// core/pagination/pagination.vo.ts

import { PAGINATION_DEFAULTS, PAGINATION_LIMITS } from "./pagination.constants";

export class PaginationVO {
  readonly page: number;
  readonly pageSize: number;

  constructor(page?: number, pageSize?: number) {
    this.page = page ?? PAGINATION_DEFAULTS.PAGE;
    this.pageSize = pageSize ?? PAGINATION_DEFAULTS.PAGE_SIZE;

    this.validate();

    Object.freeze(this);
  }

  private validate(): void {
    if (this.page < PAGINATION_LIMITS.MIN_PAGE)
      throw new Error(
        `page debe ser mayor o igual a ${PAGINATION_LIMITS.MIN_PAGE}`
      );

    if (this.pageSize < PAGINATION_LIMITS.MIN_PAGE_SIZE)
      throw new Error(
        `pageSize debe ser mayor o igual a ${PAGINATION_LIMITS.MIN_PAGE_SIZE}`
      );

    if (this.pageSize > PAGINATION_LIMITS.MAX_PAGE_SIZE)
      throw new Error(
        `pageSize no puede superar ${PAGINATION_LIMITS.MAX_PAGE_SIZE}`
      );
  }

  get offset(): number {
    return (this.page - 1) * this.pageSize;
  }
}
