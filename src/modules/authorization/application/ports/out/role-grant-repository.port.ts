export const ROLE_GRANT_REPOSITORY_TOKEN = Symbol('ROLE_GRANT_REPOSITORY');

export type RoleGrant = {
  userId: string;
  roleId: string;
  assignedByUserId: string;
};

export interface IRoleGrantRepository {
  /**
   * Persiste la concesión de un rol a una cuenta.
   */
  grant(grant: RoleGrant): Promise<void>;

  /**
   * Revoca la concesión de un rol.
   */
  revoke(userId: string, roleId: string): Promise<void>;

  /**
   * Comprueba si un rol está asignado a una cuenta.
   */
  isAssigned(userId: string, roleId: string): Promise<boolean>;
}
