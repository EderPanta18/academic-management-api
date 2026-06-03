// modules/professors/application/read-models/professor.view.ts

import { ProfessorStatus } from '@professors/domain/constants';

export type ProfessorView = {
  id: number;
  departmentId: number | null;
  code: string;
  specialty: string | null;
  institutionalEmail: string | null;
  hireDate: Date | null;
  status: ProfessorStatus;
  dni: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  birthDate: Date | null;
};
