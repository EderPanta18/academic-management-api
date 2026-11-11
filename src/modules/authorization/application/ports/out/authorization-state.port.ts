import type { Permission } from '@authorization/domain/models';

export const AUTHORIZATION_STATE_TOKEN = Symbol('AUTHORIZATION_STATE');

export type AssignedRoleAuthorizationState = {
  roleId: string;
  roleCode: string;
  permissions: Permission[];
};

export interface IAuthorizationState {
  /**
   * Obtiene los roles asignados a una cuenta y los permisos
   * vinculados a cada uno, desde el estado persistido vigente.
   */
  getAssignedRoles(userId: string): Promise<AssignedRoleAuthorizationState[]>;
}
