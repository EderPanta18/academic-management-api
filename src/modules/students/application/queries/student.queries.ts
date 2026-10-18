import type { StudentStatus } from '@students/domain/entities';

export type ListStudentsQuery = {
  academicProgramId?: string;
  status?: StudentStatus;
  search?: string;
};
