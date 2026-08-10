// src/core/pagination/pagination.vo.ts

import { type FieldError, ValidationException } from '@core/exceptions';
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
    const errors: FieldError[] = [];

    if (!Number.isInteger(this.page) || this.page < PAGINATION_PAGE.range.min)
      errors.push({
        field: 'page',
        messages: [`page debe ser un entero mayor o igual a ${PAGINATION_PAGE.range.min}.`],
      });

    if (!Number.isInteger(this.limit) || this.limit < PAGINATION_LIMIT.range.min)
      errors.push({
        field: 'limit',
        messages: [`limit debe ser un entero mayor o igual a ${PAGINATION_LIMIT.range.min}.`],
      });

    if (this.limit > PAGINATION_LIMIT.range.max)
      errors.push({
        field: 'limit',
        messages: [`limit no puede superar ${PAGINATION_LIMIT.range.max}.`],
      });

    if (errors.length > 0)
      throw new ValidationException(PaginationVO.VALIDATION_ERROR_MESSAGE, errors);
  }

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
