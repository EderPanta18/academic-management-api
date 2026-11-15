// src/modules/authorization/entrypoints/http/dtos/requests/role-fields.constants.ts

export const ROLE_FIELDS = {
  code: {
    maxLength: 100,
  },
  name: {
    maxLength: 100,
  },
  description: {
    maxLength: 1000,
  },
} as const;
