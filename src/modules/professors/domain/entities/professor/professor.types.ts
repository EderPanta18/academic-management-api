import type { ProfessorStatus } from './professor.enums';

export type ProfessorProps = {
  id: string;
  personId: string;
  code: string;
  institutionalEmail: string | null;
  department: string | null;
  specialty: string | null;
  status: ProfessorStatus;
};

export type CreateProfessorProps = {
  id: string;
  personId: string;
  code: string;
  institutionalEmail: string | null;
  department: string | null;
  specialty: string | null;
  status: ProfessorStatus | null;
};
