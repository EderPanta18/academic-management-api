// shared/dtos/bulk-result.dto.ts

type BulkRowErrorDtoProps = {
  row: number;
  field: string;
  reason: string;
};

export class BulkRowErrorDto {
  readonly row: number;
  readonly field: string;
  readonly reason: string;

  private constructor(props: BulkRowErrorDtoProps) {
    this.row = props.row;
    this.field = props.field;
    this.reason = props.reason;
  }

  static from(props: BulkRowErrorDtoProps): BulkRowErrorDto {
    return new BulkRowErrorDto(props);
  }
}

type BulkResultDtoProps = {
  totalProcessed: number;
  totalSuccess: number;
  totalFailed: number;
  errors: BulkRowErrorDto[];
};

export class BulkResultDto {
  readonly totalProcessed: number;
  readonly totalSuccess: number;
  readonly totalFailed: number;
  readonly errors: BulkRowErrorDto[];

  private constructor(props: BulkResultDtoProps) {
    this.totalProcessed = props.totalProcessed;
    this.totalSuccess = props.totalSuccess;
    this.totalFailed = props.totalFailed;
    this.errors = props.errors;
  }

  static from(
    totalProcessed: number,
    errors: BulkRowErrorDto[]
  ): BulkResultDto {
    const totalFailed = new Set(errors.map((error) => error.row)).size;
    const totalSuccess = Math.max(totalProcessed - totalFailed, 0);

    return new BulkResultDto({
      totalProcessed,
      totalSuccess,
      totalFailed,
      errors
    });
  }
}
