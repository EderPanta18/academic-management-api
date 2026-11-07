// src/modules/authorization/domain/exceptions/role.exception.ts

import { AuthorizationException } from './authorization.exception';

export abstract class RoleException extends AuthorizationException {
  override readonly entity = 'role';
}
