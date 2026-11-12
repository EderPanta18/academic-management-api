// src/modules/authorization/application/ports/out/permission-query.port.ts

import type { PermissionReadModel } from '@authorization/application/read-models';
import type { PaginationVO } from '@core/pagination';

export const PERMISSION_QUERY_TOKEN = Symbol('PERMISSION_QUERY');

export type PermissionQueryFilters = {
  module?: string;
  isReserved?: boolean;
  search?: string;
};

export interface IPermissionQuery {
  /**
   * Consulta el catálogo institucional de permisos.
   */
  findAll(
    pagination: PaginationVO,
    filters?: PermissionQueryFilters,
  ): Promise<[PermissionReadModel[], number]>;
}
