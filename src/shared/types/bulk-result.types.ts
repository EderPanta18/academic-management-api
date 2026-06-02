// shared/types/bulk-result.types.ts

export type BulkRowError = {
  row: number;
  field: string;
  reason: string;
};

export type BulkResult = {
  totalRows: number;
  totalSuccess: number;
  totalFailed: number;
  errors: BulkRowError[];
};
