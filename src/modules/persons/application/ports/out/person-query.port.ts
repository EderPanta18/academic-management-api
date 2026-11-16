// src/modules/persons/application/ports/out/person-query.port.ts

import type { PaginationVO } from '@core/pagination';
import type { PersonReadModel } from '@persons/application/read-models';

export const PERSON_QUERY_TOKEN = Symbol('PERSON_QUERY');

export type PersonQueryFilters = {
  documentTypeId?: string;
  search?: string;
};

export interface IPersonQuery {
  /**
   * Recupera el detalle de una persona.
   */
  find(id: string): Promise<PersonReadModel | null>;

  /**
   * Consulta personas con filtros y paginación.
   */
  findAll(
    pagination: PaginationVO,
    filters?: PersonQueryFilters,
  ): Promise<[PersonReadModel[], number]>;
}
