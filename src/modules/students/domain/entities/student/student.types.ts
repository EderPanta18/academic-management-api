// modules/students/domain/entities/student/student.types.ts

import { StudentStatus } from "@students/domain/constants";

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
  institutionalEmail?: string | null;
  status?: StudentStatus | null;
}
