import type { StudentStatus } from '@students/domain/enums';

export type StudentReadModel = {
  id: string;
  personId: string;
  academicProgramId: string;
  code: string;
  institutionalEmail: string | null;
  admissionPeriod: string | null;
  status: StudentStatus;

  documentTypeName: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: Date | null;
};
