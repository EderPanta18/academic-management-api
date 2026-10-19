import type { ProfessorStatus } from '@professors/domain/entities';

export type ListProfessorsQuery = {
  department?: string;
  status?: ProfessorStatus;
  search?: string;
};
