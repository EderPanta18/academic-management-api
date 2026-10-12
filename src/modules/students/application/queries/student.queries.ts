import type { StudentStatus } from '@students/domain/enums';

export type ListStudentsQuery = {
  academicProgramId?: string;
  status?: StudentStatus;
  search?: string;
};
