// modules/students/presentation/constants/student-bulk.constants.ts

export const STUDENT_BULK_IMPORT = {
  MAX_ROWS: 500,
  MIN_ROWS: 1,
  ALLOWED_EXTENSIONS: ['.csv', '.xlsx'],
  MAX_FILE_SIZE_MB: 5,
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
} as const;
