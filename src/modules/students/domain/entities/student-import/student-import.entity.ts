import { STUDENT_IMPORT } from '@students/domain/constants';
import { StudentImportStatus } from '@students/domain/enums';
import {
  StudentImportCannotFailException,
  StudentImportEmptyException,
  StudentImportNotPendingException,
  StudentImportNotProcessingException,
  StudentImportTooManyRowsException,
} from './exceptions';
import type {
  CreateStudentImportProps,
  StudentImportProps,
  StudentImportStats,
} from './student-import.types';

export class StudentImport {
  readonly id: string;
  readonly fileName: string;
  readonly fileSize: number | null;
  readonly fileMimeType: string | null;
  readonly status: StudentImportStatus;
  readonly totalRows: number;
  readonly processedRows: number;
  readonly acceptedRows: number;
  readonly rejectedRows: number;
  readonly duplicatedRows: number;
  readonly observedRows: number;
  readonly createdByUserId: string | null;
  readonly startedAt: Date | null;
  readonly finishedAt: Date | null;

  private constructor(props: StudentImportProps) {
    this.id = props.id;
    this.fileName = props.fileName;
    this.fileSize = props.fileSize;
    this.fileMimeType = props.fileMimeType;
    this.status = props.status;
    this.totalRows = props.totalRows;
    this.processedRows = props.processedRows;
    this.acceptedRows = props.acceptedRows;
    this.rejectedRows = props.rejectedRows;
    this.duplicatedRows = props.duplicatedRows;
    this.observedRows = props.observedRows;
    this.createdByUserId = props.createdByUserId;
    this.startedAt = props.startedAt;
    this.finishedAt = props.finishedAt;

    Object.freeze(this);
  }

  static reconstitute(props: StudentImportProps): StudentImport {
    return new StudentImport(props);
  }

  static create(props: CreateStudentImportProps): StudentImport {
    if (props.totalRows < STUDENT_IMPORT.rowCount.min) throw new StudentImportEmptyException();

    if (props.totalRows > STUDENT_IMPORT.rowCount.max)
      throw new StudentImportTooManyRowsException(props.totalRows, STUDENT_IMPORT.rowCount.max);

    return new StudentImport({
      id: props.id,
      fileName: props.fileName,
      fileSize: props.fileSize ?? null,
      fileMimeType: props.fileMimeType ?? null,
      status: StudentImportStatus.PENDING,
      totalRows: props.totalRows,
      processedRows: 0,
      acceptedRows: 0,
      rejectedRows: 0,
      duplicatedRows: 0,
      observedRows: 0,
      createdByUserId: props.createdByUserId ?? null,
      startedAt: null,
      finishedAt: null,
    });
  }

  markAsProcessing(): StudentImport {
    if (this.status !== StudentImportStatus.PENDING)
      throw new StudentImportNotPendingException(this.id, this.status);

    return new StudentImport({
      ...this,
      status: StudentImportStatus.PROCESSING,
      startedAt: new Date(),
    });
  }

  markAsCompleted(stats: StudentImportStats): StudentImport {
    if (this.status !== StudentImportStatus.PROCESSING)
      throw new StudentImportNotProcessingException(this.id, this.status);

    const hasRejections = stats.rejectedRows > 0 || stats.duplicatedRows > 0;

    return new StudentImport({
      ...this,
      status: hasRejections
        ? StudentImportStatus.COMPLETED_WITH_ERRORS
        : StudentImportStatus.COMPLETED,
      totalRows: stats.totalRows,
      processedRows: stats.processedRows,
      acceptedRows: stats.acceptedRows,
      rejectedRows: stats.rejectedRows,
      duplicatedRows: stats.duplicatedRows,
      observedRows: stats.observedRows,
      finishedAt: new Date(),
    });
  }

  markAsFailed(): StudentImport {
    const canFail =
      this.status === StudentImportStatus.PENDING || this.status === StudentImportStatus.PROCESSING;

    if (!canFail) throw new StudentImportCannotFailException(this.id, this.status);

    return new StudentImport({
      ...this,
      status: StudentImportStatus.FAILED,
      finishedAt: new Date(),
    });
  }
}
