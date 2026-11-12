// src/modules/authorization/application/ports/out/permission-repository.port.ts

import type { Permission } from '@authorization/domain/models';

export const PERMISSION_REPOSITORY_TOKEN = Symbol('PERMISSION_REPOSITORY');

export interface IPermissionRepository {
  /**
   * Recupera permisos por sus identificadores.
   * Omite los identificadores inexistentes.
   */
  findManyByIds(ids: string[]): Promise<Permission[]>;

  /**
   * Recupera permisos por sus códigos institucionales.
   * Omite los códigos inexistentes.
   */
  findManyByCodes(codes: string[]): Promise<Permission[]>;
}
