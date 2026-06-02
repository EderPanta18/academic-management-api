// modules/professors/domain/entities/professor/professor.types.ts

import { ProfessorStatus } from "@professors/domain/constants";

export interface ProfessorProps {
  id: number;
  code: string;
  departmentId: number | null;
  specialty: string | null;
  institutionalEmail: string | null;
  hireDate: Date | null;
  status: ProfessorStatus;
}

export interface CreateProfessorProps {
  code: string;
  departmentId?: number | null;
  specialty?: string | null;
  institutionalEmail?: string | null;
  hireDate?: Date | null;
  status?: ProfessorStatus | null;
}
