import type { PaginationVO } from '@core/pagination';
import type { ProfessorReadModel } from '@professors/application/read-models';
import type { ProfessorStatus } from '@professors/domain/entities';

export const PROFESSOR_QUERY_TOKEN = Symbol('PROFESSOR_QUERY');

export type ProfessorQueryFilters = {
  department?: string;
  status?: ProfessorStatus;
  search?: string;
};

export interface IProfessorQuery {
  find(id: string): Promise<ProfessorReadModel | null>;

  findAll(
    pagination: PaginationVO,
    filters?: ProfessorQueryFilters,
  ): Promise<[ProfessorReadModel[], number]>;
}
