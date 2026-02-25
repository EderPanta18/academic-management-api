// shared/domain/constants/pagination.constants.ts

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 20,
} as const;

export const PAGINATION_LIMITS = {
  MIN_PAGE: 1,
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,
} as const;
