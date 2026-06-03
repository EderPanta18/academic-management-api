// modules/professors/domain/entities/professor/professor.types.ts

import type { ProfessorStatus } from '@professors/domain/constants';

export interface ProfessorProps {
  id: number;
  departmentId: number | null;
  code: string;
  specialty: string | null;
  institutionalEmail: string | null;
  hireDate: Date | null;
  status: ProfessorStatus;
}

export interface CreateProfessorProps {
  departmentId?: number | null;
  code: string;
  specialty?: string | null;
  institutionalEmail?: string | null;
  hireDate?: Date | null;
  status?: ProfessorStatus | null;
}
