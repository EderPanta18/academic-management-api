export const STUDENT_CODE = {
  length: {
    min: 1,
    max: 50,
  },
  pattern: /^[A-Z0-9-]+$/,
} as const;

export const STUDENT_INSTITUTIONAL_EMAIL = {
  length: {
    min: 1,
    max: 255,
  },
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const STUDENT_ADMISSION_PERIOD = {
  length: {
    min: 1,
    max: 50,
  },
} as const;

export const STUDENT = {
  code: STUDENT_CODE,
  institutionalEmail: STUDENT_INSTITUTIONAL_EMAIL,
  admissionPeriod: STUDENT_ADMISSION_PERIOD,
} as const;
