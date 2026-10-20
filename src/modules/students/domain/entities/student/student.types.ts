import type { StudentStatus } from '@students/domain/entities';

export type StudentProps = {
  id: string;
  personId: string;
  academicProgramId: string;
  code: string;
  institutionalEmail: string | null;
  admissionPeriod: string | null;
  status: StudentStatus;
};

export type CreateStudentProps = {
  id: string;
  personId: string;
  academicProgramId: string;
  code: string;
  institutionalEmail: string | null;
  admissionPeriod: string | null;
  status: StudentStatus | null;
};
