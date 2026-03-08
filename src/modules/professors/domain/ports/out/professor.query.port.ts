// modules/professors/domain/ports/out/professor.query.port.ts

import { PaginationVO } from '@shared/domain/value-objects';
import { type ProfessorView } from '@professors/domain/read-models';

export interface FindAllProfessorsFilters {
  departmentId?: number;
}

/**
 * Puerto de salida READ — consultas optimizadas que retornan
 * ProfessorView en lugar de la entidad de dominio.
 */
export interface IProfessorQuery {
  findById(id: number): Promise<ProfessorView | null>;
  findAll(
    pagination: PaginationVO,
    filters?: FindAllProfessorsFilters,
  ): Promise<[ProfessorView[], number]>;
}
