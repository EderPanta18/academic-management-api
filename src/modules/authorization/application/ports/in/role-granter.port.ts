// src/modules/authorization/application/ports/in/role-granter.port.ts

export const ROLE_GRANTER_TOKEN = Symbol('ROLE_GRANTER');

export type InitialRoleGrant = {
  userId: string;
  roleIds: string[];
};

export interface IRoleGranter {
  /**
   * Concede los roles iniciales durante la creación de una cuenta.
   */
  grantInitialRoles(actorUserId: string, grant: InitialRoleGrant): Promise<void>;
}
