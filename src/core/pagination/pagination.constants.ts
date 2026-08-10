// src/core/pagination/pagination.constants.ts

export const PAGINATION_PAGE = {
  default: 1,
  range: {
    min: 1,
  },
} as const;

export const PAGINATION_LIMIT = {
  default: 20,
  range: {
    min: 1,
    max: 100,
  },
} as const;
