// core/pagination/pagination.constants.ts

export const PAGINATION_DEFAULTS = {
  page: 1,
  pageSize: 20,
} as const;

export const PAGINATION_LIMITS = {
  minPage: 1,
  minPageSize: 1,
  maxPageSize: 100,
} as const;
