export const PERSON_DOCUMENT_NUMBER = {
  length: {
    min: 1,
    max: 50,
  },
  pattern: /^[A-Z0-9-]+$/,
} as const;

export const PERSON_FIRST_NAME = {
  length: {
    min: 1,
    max: 100,
  },
} as const;

export const PERSON_LAST_NAME = {
  length: {
    min: 1,
    max: 100,
  },
} as const;

export const PERSON_EMAIL = {
  length: {
    min: 1,
    max: 255,
  },
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const PERSON_PHONE = {
  length: {
    max: 30,
  },
} as const;

export const PERSON = {
  documentNumber: PERSON_DOCUMENT_NUMBER,
  firstName: PERSON_FIRST_NAME,
  lastName: PERSON_LAST_NAME,
  email: PERSON_EMAIL,
  phone: PERSON_PHONE,
} as const;
