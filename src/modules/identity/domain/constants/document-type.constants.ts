export const DOCUMENT_TYPE_CODE = {
  length: {
    min: 1,
    max: 50,
  },
  pattern: /^[A-Z0-9_]+$/,
} as const;

export const DOCUMENT_TYPE_NAME = {
  length: {
    min: 1,
    max: 100,
  },
} as const;

export const DOCUMENT_TYPE_DESCRIPTION = {
  length: {
    max: 500,
  },
} as const;

export const DOCUMENT_TYPE = {
  code: DOCUMENT_TYPE_CODE,
  name: DOCUMENT_TYPE_NAME,
  description: DOCUMENT_TYPE_DESCRIPTION,
} as const;
