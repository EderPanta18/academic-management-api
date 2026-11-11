export const ACCOUNT_ROLE_INSPECTOR_TOKEN = Symbol('ACCOUNT_ROLE_INSPECTOR');

export type AccountRoleClassification = 'SUPER_ADMIN' | 'ADMIN' | 'ORDINARY';

export interface IAccountRoleInspector {
  /**
   * Clasifica una cuenta según sus asignaciones vigentes.
   */
  classify(userId: string): Promise<AccountRoleClassification>;
}
