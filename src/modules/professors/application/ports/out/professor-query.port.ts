// modules/professors/application/ports/out/professor-query.port.ts

import { PaginationVO } from "@core/pagination";
import type { ProfessorView } from "@professors/application/read-models";

export const PROFESSOR_QUERY_PORT = Symbol("PROFESSOR_QUERY_PORT");

export interface FindAllProfessorsFilters {
  departmentId?: number;
}

export interface IProfessorQuery {
  findById(id: number): Promise<ProfessorView | null>;

  findAll(
    pagination: PaginationVO,
    filters?: FindAllProfessorsFilters
  ): Promise<[ProfessorView[], number]>;
}
