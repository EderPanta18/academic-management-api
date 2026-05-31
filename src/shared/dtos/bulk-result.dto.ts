export class BulkRowErrorDto {
  readonly row: number;
  readonly field: string;
  readonly reason: string;

  private constructor(row: number, field: string, reason: string) {
    this.row = row;
    this.field = field;
    this.reason = reason;
  }

  static from(row: number, field: string, reason: string): BulkRowErrorDto {
    return new BulkRowErrorDto(row, field, reason);
  }
}

export class BulkResultDto {
  readonly totalProcessed: number;
  readonly totalSuccess: number;
  readonly totalFailed: number;
  readonly errors: BulkRowErrorDto[];

  private constructor(
    totalProcessed: number,
    totalSuccess: number,
    totalFailed: number,
    errors: BulkRowErrorDto[],
  ) {
    this.totalProcessed = totalProcessed;
    this.totalSuccess = totalSuccess;
    this.totalFailed = totalFailed;
    this.errors = errors;
  }

  static from(totalProcessed: number, errors: BulkRowErrorDto[]): BulkResultDto {
    const failedRows = new Set(errors.map((error) => error.row)).size;
    const totalSuccess = totalProcessed - failedRows;

    return new BulkResultDto(totalProcessed, totalSuccess, failedRows, errors);
  }
}

