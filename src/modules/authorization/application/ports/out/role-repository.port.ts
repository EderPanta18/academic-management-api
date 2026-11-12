// src/modules/authorization/application/ports/out/role-repository.port.ts

import type { Role } from '@authorization/domain/entities';

export const ROLE_REPOSITORY_TOKEN = Symbol('ROLE_REPOSITORY');

export interface IRoleRepository {
  /**
   * Crea un rol con su composición inicial de permisos.
   */
  create(role: Role, permissionIds: string[]): Promise<Role>;

  /**
   * Actualiza un rol y opcionalmente su composición.
   *
   * undefined: conserva los permisos existentes.
   * []: elimina todas las asociaciones.
   * [ids]: reemplaza la composición actual.
   */
  update(role: Role, permissionIds?: string[]): Promise<Role>;

  /**
   * Recupera un rol por identificador.
   */
  find(id: string): Promise<Role | null>;

  /**
   * Comprueba la existencia de un código de rol.
   */
  existsByCode(code: string): Promise<boolean>;
}
