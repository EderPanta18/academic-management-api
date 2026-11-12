// src/modules/authorization/application/services/account-role-inspector.service.ts

import { INSTITUTIONAL_ROLES } from '@authorization/domain/constants';
import { Inject, Injectable } from '@nestjs/common';
import {
  type AccountRoleClassification,
  AUTHORIZATION_STATE_TOKEN,
  type IAccountRoleInspector,
  type IAuthorizationState,
} from '../ports';

@Injectable()
export class AccountRoleInspectorService implements IAccountRoleInspector {
  constructor(
    @Inject(AUTHORIZATION_STATE_TOKEN)
    private readonly authorizationState: IAuthorizationState,
  ) {}

  async classify(userId: string): Promise<AccountRoleClassification> {
    const assignedRoles = await this.authorizationState.getAssignedRoles(userId);

    const roleCodes = new Set(assignedRoles.map((role) => role.roleCode));

    if (roleCodes.has(INSTITUTIONAL_ROLES.SUPER_ADMIN)) return 'SUPER_ADMIN';

    if (roleCodes.has(INSTITUTIONAL_ROLES.ADMIN)) return 'ADMIN';

    return 'ORDINARY';
  }
}
