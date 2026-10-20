export const ACADEMIC_PERIOD_FIELDS = {
  code: {
    maxLength: 50,
    pattern: /^[A-Z0-9-]+$/,
  },
  name: {
    maxLength: 150,
  },
} as const;
