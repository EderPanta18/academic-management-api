// src/modules/authorization/application/ports/out/role-query.port.ts

import type {
  RoleDetailReadModel,
  RoleReadModel,
  RoleUserReadModel,
} from '@authorization/application/read-models';
import type { PaginationVO } from '@core/pagination';

export const ROLE_QUERY_TOKEN = Symbol('ROLE_QUERY');

export type RoleQueryFilters = {
  isSystem?: boolean;
  search?: string;
};

export interface IRoleQuery {
  /**
   * Recupera el detalle de un rol.
   */
  find(id: string): Promise<RoleDetailReadModel | null>;

  /**
   * Consulta roles con filtros y paginación.
   */
  findAll(pagination: PaginationVO, filters?: RoleQueryFilters): Promise<[RoleReadModel[], number]>;

  /**
   * Consulta las cuentas vinculadas a un rol.
   */
  findRoleUsers(roleId: string, pagination: PaginationVO): Promise<[RoleUserReadModel[], number]>;
}
