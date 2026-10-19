export const COURSE_FIELDS = {
  code: {
    maxLength: 50,
    pattern: /^[A-Z0-9-]+$/,
  },
  name: {
    maxLength: 150,
  },
  description: {
    maxLength: 1000,
  },
  credits: {
    min: 1,
    max: 4,
  },
  hours: {
    min: 1,
    max: 1000,
  },
} as const;
