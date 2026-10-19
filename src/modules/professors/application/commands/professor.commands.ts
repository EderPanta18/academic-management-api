import type { ProfessorStatus } from '@professors/domain/entities';

export type CreateProfessorCommand = {
  documentTypeId: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
  code: string;
  institutionalEmail: string | null;
  department: string | null;
  specialty: string | null;
  status: ProfessorStatus | null;
};
