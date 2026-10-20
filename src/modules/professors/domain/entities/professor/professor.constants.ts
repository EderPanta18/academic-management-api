import { ProfessorStatus } from './professor.enums';

export const PROFESSOR = {
  defaults: {
    status: ProfessorStatus.ACTIVE,
  },
} as const;
