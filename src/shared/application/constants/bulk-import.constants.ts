// shared/application/constants/bulk-import.constants.ts

export const BULK_IMPORT = {
  MAX_ROWS: 500,
  MIN_ROWS: 1,
  ALLOWED_EXTENSIONS: ['.csv', '.xlsx'],
  MAX_FILE_SIZE_MB: 5,
} as const;
