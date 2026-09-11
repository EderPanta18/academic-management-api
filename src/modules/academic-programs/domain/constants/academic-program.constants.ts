export const ACADEMIC_PROGRAM_CODE = {
  length: {
    min: 1,
    max: 50,
  },
  pattern: /^[A-Z0-9-]+$/,
} as const;

export const ACADEMIC_PROGRAM_NAME = {
  length: {
    min: 1,
    max: 150,
  },
} as const;

export const ACADEMIC_PROGRAM_ACADEMIC_UNIT = {
  length: {
    max: 150,
  },
} as const;

export const ACADEMIC_PROGRAM = {
  code: ACADEMIC_PROGRAM_CODE,
  name: ACADEMIC_PROGRAM_NAME,
  academicUnit: ACADEMIC_PROGRAM_ACADEMIC_UNIT,
} as const;
