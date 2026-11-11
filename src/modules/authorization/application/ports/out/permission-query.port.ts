import type { ListPermissionsQuery } from '@authorization/application/queries';
import type { PermissionReadModel } from '@authorization/application/read-models';
import type { PaginationVO } from '@core/pagination';

export const PERMISSION_QUERY_TOKEN = Symbol('PERMISSION_QUERY');

export interface IPermissionQuery {
  /**
   * Consulta el catálogo institucional de permisos.
   */
  findAll(
    pagination: PaginationVO,
    filters?: ListPermissionsQuery,
  ): Promise<[PermissionReadModel[], number]>;
}
