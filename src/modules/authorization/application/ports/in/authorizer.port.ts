// src/modules/authorization/application/ports/in/authorizer.port.ts

export const AUTHORIZER_TOKEN = Symbol('AUTHORIZER');

export interface IAuthorizer {
  /**
   * Comprueba que el actor dispone de todos los permisos requeridos.
   *
   * Los permisos reservados requieren además pertenecer
   * a ADMIN o SUPER_ADMIN.
   *
   * Rechaza permisos desconocidos, ausentes o no concedidos.
   */
  assertAuthorized(actorUserId: string, permissionCodes: string[]): Promise<void>;
}
