import type { ProfessorStatus } from '@professors/domain/entities';

export type ProfessorReadModel = {
  id: string;
  personId: string;
  code: string;
  institutionalEmail: string | null;
  department: string | null;
  specialty: string | null;
  status: ProfessorStatus;

  // Datos de persona
  documentTypeName: string;
  documentNumber: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  birthDate: Date | null;
};
