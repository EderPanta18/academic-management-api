// shared/dtos/bulk-result.dto.ts

import type { BulkResult, BulkRowError } from "../types";

interface BulkRowErrorDtoProps {
  row: number;
  field: string;
  reason: string;
}

export class BulkRowErrorDto {
  readonly row: number;
  readonly field: string;
  readonly reason: string;

  private constructor(props: BulkRowErrorDtoProps) {
    this.row = props.row;
    this.field = props.field;
    this.reason = props.reason;
  }

  static from(error: BulkRowError): BulkRowErrorDto {
    return new BulkRowErrorDto({
      row: error.row,
      field: error.field,
      reason: error.reason
    });
  }
}

interface BulkResultDtoProps {
  totalRows: number;
  totalSuccess: number;
  totalFailed: number;
  errors: BulkRowErrorDto[];
}

export class BulkResultDto {
  readonly totalRows: number;
  readonly totalSuccess: number;
  readonly totalFailed: number;
  readonly errors: BulkRowErrorDto[];

  private constructor(props: BulkResultDtoProps) {
    this.totalRows = props.totalRows;
    this.totalSuccess = props.totalSuccess;
    this.totalFailed = props.totalFailed;
    this.errors = props.errors;
  }

  static from(result: BulkResult): BulkResultDto {
    return new BulkResultDto({
      totalRows: result.totalRows,
      totalSuccess: result.totalSuccess,
      totalFailed: result.totalFailed,
      errors: result.errors.map(BulkRowErrorDto.from)
    });
  }
}
