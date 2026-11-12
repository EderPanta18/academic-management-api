// src/modules/authorization/application/services/authorizer.service.ts

import { PermissionPolicy } from '@authorization/domain/policies';
import { ForbiddenException } from '@core/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import {
  AUTHORIZATION_STATE_TOKEN,
  type IAuthorizationState,
  type IAuthorizer,
  type IPermissionRepository,
  PERMISSION_REPOSITORY_TOKEN,
} from '../ports';

class AuthorizationDeniedException extends ForbiddenException {
  readonly errorCode = 'AUTHZ_ACCESS_DENIED';

  constructor() {
    super('No tiene permisos para realizar esta operación.');
  }
}

@Injectable()
export class AuthorizerService implements IAuthorizer {
  constructor(
    @Inject(AUTHORIZATION_STATE_TOKEN)
    private readonly authorizationState: IAuthorizationState,

    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async assertAuthorized(actorUserId: string, permissionCodes: string[]): Promise<void> {
    const requiredCodes = [...new Set(permissionCodes)];

    if (requiredCodes.length === 0) throw new AuthorizationDeniedException();

    const requiredPermissions = await this.permissionRepository.findManyByCodes(requiredCodes);

    const resolvedCodes = new Set(requiredPermissions.map((permission) => permission.code));

    if (requiredCodes.some((code) => !resolvedCodes.has(code)))
      throw new AuthorizationDeniedException();

    const assignedRoles = await this.authorizationState.getAssignedRoles(actorUserId);

    const actorRoleCodes = assignedRoles.map((role) => role.roleCode);

    const effectivePermissionCodes = PermissionPolicy.resolveEffectivePermissions(
      assignedRoles.map((role) => role.permissions),
    );

    const allowed = PermissionPolicy.hasRequiredPermissions(
      effectivePermissionCodes,
      actorRoleCodes,
      requiredPermissions,
    );

    if (!allowed) throw new AuthorizationDeniedException();
  }
}
