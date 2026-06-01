// modules/professors/domain/entities/professor.types.ts

import { ProfessorStatus } from "../constants";
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
  code: string;
  departmentId?: number;
  specialty?: string;
  institutionalEmail?: string;
  hireDate?: Date;
  status?: ProfessorStatus;
}
