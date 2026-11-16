// src/modules/persons/entrypoints/http/dtos/requests/person-fields.constants.ts

export const PERSON_FIELDS = {
  documentNumber: {
    maxLength: 50,
  },
  firstName: {
    maxLength: 100,
  },
  lastName: {
    maxLength: 100,
  },
  email: {
    maxLength: 255,
  },
  phone: {
    maxLength: 30,
  },
} as const;
