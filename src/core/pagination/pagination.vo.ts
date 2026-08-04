// src/core/pagination/pagination.vo.ts

import { ValidationException } from '@core/exceptions';
import { PAGINATION_LIMIT, PAGINATION_PAGE } from './pagination.constants';

export type CreatePaginationProps = {
  page?: number;
  limit?: number;
};

export class PaginationVO {
  private static readonly VALIDATION_ERROR_MESSAGE = 'Los parámetros de paginación no son válidos.';

  readonly page: number;
  readonly limit: number;

  private constructor(page?: number, limit?: number) {
    this.page = page ?? PAGINATION_PAGE.default;
    this.limit = limit ?? PAGINATION_LIMIT.default;

    this.validate();

    Object.freeze(this);
  }

  static create(props: CreatePaginationProps = {}): PaginationVO {
    return new PaginationVO(props.page, props.limit);
  }

  private validate(): void {
    if (!Number.isInteger(this.page) || this.page < PAGINATION_PAGE.min)
      this.throwValidationError(
        'page',
        `page debe ser un entero mayor o igual a ${PAGINATION_PAGE.min}.`,
      );

    if (!Number.isInteger(this.limit) || this.limit < PAGINATION_LIMIT.range.min)
      this.throwValidationError(
        'limit',
        `limit debe ser un entero mayor o igual a ${PAGINATION_LIMIT.range.min}.`,
      );

    if (this.limit > PAGINATION_LIMIT.range.max)
      this.throwValidationError('limit', `limit no puede superar ${PAGINATION_LIMIT.range.max}.`);
  }

  private throwValidationError(field: string, message: string): void {
    throw new ValidationException(PaginationVO.VALIDATION_ERROR_MESSAGE, [{ field, message }]);
  }

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
