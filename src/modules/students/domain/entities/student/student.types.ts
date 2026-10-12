import type { StudentStatus } from '@students/domain/enums';

export interface StudentProps {
  id: string;
  personId: string;
  academicProgramId: string;
  code: string;
  institutionalEmail: string | null;
  admissionPeriod: string | null;
  status: StudentStatus;
}

export interface CreateStudentProps {
  id: string;
  personId: string;
  academicProgramId: string;
  code: string;
  institutionalEmail?: string | null;
  admissionPeriod?: string | null;
  status?: StudentStatus;
}
