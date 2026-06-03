// modules/students/application/commands/bulk-import-students.command.ts

import type { BulkRowError } from '@shared/types';

export type StudentRowInput = {
  rowNumber: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  code: string;
  careerId: number;
  enrollmentDate: string;
  institutionalEmail?: string;
  phone?: string;
  birthDate?: string;
};

interface BulkImportStudentsCommandProps {
  validRows: StudentRowInput[];
  preErrors: BulkRowError[];
  totalRows: number;
}

export class BulkImportStudentsCommand {
  readonly validRows: StudentRowInput[];
  readonly preErrors: BulkRowError[];
  readonly totalRows: number;

  constructor(props: BulkImportStudentsCommandProps) {
    this.validRows = props.validRows;
    this.preErrors = props.preErrors;
    this.totalRows = props.totalRows;
  }
}
