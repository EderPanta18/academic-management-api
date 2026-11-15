// src/modules/authorization/application/services/role-granter.service.ts

import { RolePolicy } from '@authorization/domain/policies';
import {
  AUDIT_WRITER_TOKEN,
  type IAuditWriter,
  type ITransactionManager,
  TRANSACTION_MANAGER_TOKEN,
} from '@core/contracts';
import { SystemException } from '@core/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import {
  RoleAlreadyAssignedException,
  RoleGrantChangeNotAllowedException,
  RoleNotFoundException,
} from '../exceptions';
import {
  AUTHORIZATION_STATE_TOKEN,
  AUTHORIZER_TOKEN,
  type IAuthorizationState,
  type IAuthorizer,
  type InitialRoleGrant,
  type IRoleGranter,
  type IRoleGrantRepository,
  type IRoleRepository,
  ROLE_GRANT_REPOSITORY_TOKEN,
  ROLE_REPOSITORY_TOKEN,
} from '../ports';

@Injectable()
export class RoleGranterService implements IRoleGranter {
  constructor(
    @Inject(TRANSACTION_MANAGER_TOKEN)
    private readonly transactionManager: ITransactionManager,

    @Inject(AUDIT_WRITER_TOKEN)
    private readonly auditWriter: IAuditWriter,

    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(AUTHORIZATION_STATE_TOKEN)
    private readonly authorizationState: IAuthorizationState,

    @Inject(ROLE_REPOSITORY_TOKEN)
    private readonly roleRepository: IRoleRepository,

    @Inject(ROLE_GRANT_REPOSITORY_TOKEN)
    private readonly roleGrantRepository: IRoleGrantRepository,
  ) {}

  async grantInitialRoles(actorUserId: string, grant: InitialRoleGrant): Promise<void> {
    const { userId, roleIds } = grant;

    if (roleIds.length === 0) return;

    if (!this.transactionManager.isActive())
      throw new SystemException('La concesión de roles iniciales requiere una transacción activa.');

    await this.authorizer.assertAuthorized(actorUserId, ['role-grants.grant']);

    const uniqueRoleIds = [...new Set(roleIds)];

    await this.assertInitialGrantsAllowed(actorUserId, userId, uniqueRoleIds);

    for (const roleId of uniqueRoleIds) {
      const granted = await this.roleGrantRepository.grant({
        userId,
        roleId,
        assignedByUserId: actorUserId,
      });

      if (!granted) throw new RoleAlreadyAssignedException(userId, roleId);

      await this.auditWriter.append({
        actorUserId,
        action: 'authorization.role-grant.grant',
        module: 'authorization',
        resourceType: 'RoleGrant',
        outcome: 'CONFIRMED',
        metadata: {
          userId,
          roleId,
        },
      });
    }
  }

  private async assertInitialGrantsAllowed(
    actorUserId: string,
    userId: string,
    roleIds: string[],
  ): Promise<void> {
    const [actorRoles, targetRoles, roles] = await Promise.all([
      this.authorizationState.getAssignedRoles(actorUserId),
      this.authorizationState.getAssignedRoles(userId),
      this.roleRepository.findManyByIds(roleIds),
    ]);

    const rolesById = new Map(roles.map((role) => [role.id, role]));

    const actorRoleCodes = actorRoles.map((role) => role.roleCode);
    const targetRoleCodes = targetRoles.map((role) => role.roleCode);

    for (const roleId of roleIds) {
      const role = rolesById.get(roleId);

      if (!role) throw new RoleNotFoundException(roleId);

      if (
        !RolePolicy.canChangeAssignment({
          actorUserId,
          targetUserId: userId,
          roleCode: role.code,
          actorRoleCodes,
          targetRoleCodes,
        })
      )
        throw new RoleGrantChangeNotAllowedException(userId, role.code);

      targetRoleCodes.push(role.code);
    }
  }
}
