// src/modules/authorization/application/ports/out/role-grant-repository.port.ts

export const ROLE_GRANT_REPOSITORY_TOKEN = Symbol('ROLE_GRANT_REPOSITORY');

export type RoleGrant = {
  userId: string;
  roleId: string;
  assignedByUserId: string;
};

export interface IRoleGrantRepository {
  /**
   * Concede un rol a una cuenta.
   * Devuelve false si la asignación ya existe.
   */
  grant(grant: RoleGrant): Promise<boolean>;

  /**
   * Revoca un rol asignado a una cuenta.
   * Devuelve false si la asignación no existe.
   */
  revoke(userId: string, roleId: string): Promise<boolean>;
}
