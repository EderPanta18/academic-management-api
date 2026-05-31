// modules/students/application/commands/bulk-import-students.command.ts

import { BulkRowErrorDto } from '@shared/dtos';

export interface StudentRowInput {
  rowNumber: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  code: string;
  careerId: number;
  enrollmentDate: string; // YYYY-MM-DD
  institutionalEmail?: string;
  phone?: string;
  birthDate?: string; // YYYY-MM-DD
}

export class BulkImportStudentsCommand {
  readonly validRows: StudentRowInput[];
  readonly preErrors: BulkRowErrorDto[];
  readonly totalInFile: number;

  constructor(props: {
    validRows: StudentRowInput[];
    preErrors: BulkRowErrorDto[];
    totalInFile: number;
  }) {
    this.validRows = props.validRows;
    this.preErrors = props.preErrors;
    this.totalInFile = props.totalInFile;
  }
}
