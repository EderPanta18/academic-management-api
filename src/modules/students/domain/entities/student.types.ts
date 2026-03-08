// modules/students/domain/entities/student.types.ts

import { StudentStatus } from '../constants';

export interface StudentProps {
  id: number;
  careerId: number;
  code: string;
  institutionalEmail: string | null;
  enrollmentDate: Date;
  status: StudentStatus;
}

export interface CreateStudentProps {
  careerId: number;
  code: string;
  enrollmentDate: Date;
  institutionalEmail?: string;
  status?: StudentStatus;
}
