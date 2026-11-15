// src/modules/authorization/application/validators/role-assignment.validator.ts

import { RolePolicy } from '@authorization/domain/policies';
import { Inject, Injectable } from '@nestjs/common';
import { RoleGrantChangeNotAllowedException, RoleNotFoundException } from '../exceptions';
import {
  AUTHORIZATION_STATE_TOKEN,
  type IAuthorizationState,
  type IRoleRepository,
  ROLE_REPOSITORY_TOKEN,
} from '../ports/out';

@Injectable()
export class RoleAssignmentValidator {
  constructor(
    @Inject(AUTHORIZATION_STATE_TOKEN)
    private readonly authorizationState: IAuthorizationState,

    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: IRoleRepository,
  ) {}

  async assertChangeAllowed(
    actorUserId: string,
    targetUserId: string,
    roleId: string,
  ): Promise<void> {
    const role = await this.roleRepository.find(roleId);

    if (!role) throw new RoleNotFoundException(roleId);

    const [actorRoles, targetRoles] = await Promise.all([
      this.authorizationState.getAssignedRoles(actorUserId),
      this.authorizationState.getAssignedRoles(targetUserId),
    ]);

    if (
      !RolePolicy.canChangeAssignment({
        actorUserId,
        targetUserId,
        roleCode: role.code,
        actorRoleCodes: actorRoles.map((role) => role.roleCode),
        targetRoleCodes: targetRoles.map((role) => role.roleCode),
      })
    )
      throw new RoleGrantChangeNotAllowedException(targetUserId, role.code);
  }
}
