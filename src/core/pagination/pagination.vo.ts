// src/core/pagination/pagination.vo.ts

import { type FieldError, ValidationException } from '@core/exceptions';
import { PAGINATION_LIMIT, PAGINATION_PAGE } from './pagination.constants';

export type CreatePaginationProps = {
  page?: number;
  limit?: number;
};

export class PaginationVO {
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

    if (!Number.isSafeInteger(this.page) || this.page < PAGINATION_PAGE.range.min)
      errors.push({
        field: 'page',
        messages: [`page debe ser un entero seguro mayor o igual a ${PAGINATION_PAGE.range.min}.`],
      });

    if (
      !Number.isSafeInteger(this.limit) ||
      this.limit < PAGINATION_LIMIT.range.min ||
      this.limit > PAGINATION_LIMIT.range.max
    )
      errors.push({
        field: 'limit',
        messages: [
          `limit debe ser un entero entre ${PAGINATION_LIMIT.range.min} y ${PAGINATION_LIMIT.range.max}.`,
        ],
      });

    if (errors.length === 0 && !Number.isSafeInteger((this.page - 1) * this.limit))
      errors.push({
        field: 'page',
        messages: ['page produce un desplazamiento fuera del rango seguro.'],
      });

    if (errors.length > 0)
      throw new ValidationException('Los parámetros de paginación no son válidos.', errors);
  }

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
