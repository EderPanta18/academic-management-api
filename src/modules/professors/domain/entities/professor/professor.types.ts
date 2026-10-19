import type { ProfessorStatus } from './professor.enums';

export interface ProfessorProps {
  id: string;
  personId: string;
  code: string;
  institutionalEmail: string | null;
  department: string | null;
  specialty: string | null;
  status: ProfessorStatus;
}

export interface CreateProfessorProps {
  id: string;
  personId: string;
  code: string;
  institutionalEmail: string | null;
  department: string | null;
  specialty: string | null;
  status: ProfessorStatus | null;
}
