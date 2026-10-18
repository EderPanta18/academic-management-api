export const STUDENT_IMPORT_UPLOAD = {
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_MIME_TYPES: [
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  ALLOWED_EXTENSIONS: ['.csv', '.xlsx'],
} as const;
