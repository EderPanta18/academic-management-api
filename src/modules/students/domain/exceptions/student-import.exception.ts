import { StudentException } from './student.exception';

export abstract class StudentImportException extends StudentException {
  override readonly entity = 'student_import';
}
