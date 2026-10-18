import type { StudentStatus } from '@students/domain/entities';

export type CreateStudentCommand = {
  documentTypeId: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
  academicProgramId: string;
  code: string;
  institutionalEmail: string | null;
  admissionPeriod: string | null;
  status: StudentStatus | null;
};
