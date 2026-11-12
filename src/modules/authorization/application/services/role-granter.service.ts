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
  RoleNotAssignedException,
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

type RoleContext = {
  actorRoleCodes: string[];
  targetRoleCodes: string[];
};

type RoleChangeContext = RoleContext & {
  actorUserId: string;
  targetUserId: string;
  roleCode: string;
};

type RoleGrantRequest = {
  actorUserId: string;
  userId: string;
  roleId: string;
};

type RoleGrantAudit = RoleGrantRequest & {
  action: 'grant' | 'revoke';
};

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

  async grantRole(actorUserId: string, userId: string, roleId: string): Promise<void> {
    await this.transactionManager.run(
      async () => {
        await this.authorizer.assertAuthorized(actorUserId, ['role-grants.grant']);

        const context = await this.getRoleContext(actorUserId, userId);

        await this.grant({ actorUserId, userId, roleId }, context);
      },
      { isolation: 'SERIALIZABLE', retries: 2 },
    );
  }

  async revokeRole(actorUserId: string, userId: string, roleId: string): Promise<void> {
    await this.transactionManager.run(
      async () => {
        await this.authorizer.assertAuthorized(actorUserId, ['role-grants.revoke']);

        const role = await this.roleRepository.find(roleId);

        if (!role) throw new RoleNotFoundException(roleId);

        const context = await this.getRoleContext(actorUserId, userId);

        this.assertChangeAllowed({
          actorUserId,
          targetUserId: userId,
          roleCode: role.code,
          ...context,
        });

        if (!(await this.roleGrantRepository.isAssigned(userId, roleId)))
          throw new RoleNotAssignedException(userId, roleId);

        await this.roleGrantRepository.revoke(userId, roleId);

        await this.recordGrant({
          actorUserId,
          userId,
          roleId,
          action: 'revoke',
        });
      },
      { isolation: 'SERIALIZABLE', retries: 2 },
    );
  }

  async grantInitialRoles(actorUserId: string, initialGrant: InitialRoleGrant): Promise<void> {
    const { userId, roleIds } = initialGrant;

    if (roleIds.length === 0) return;

    if (!this.transactionManager.isActive())
      throw new SystemException('La concesión de roles iniciales requiere una transacción activa.');

    await this.authorizer.assertAuthorized(actorUserId, ['role-grants.grant']);

    const context = await this.getRoleContext(actorUserId, userId);

    for (const roleId of new Set(roleIds))
      await this.grant({ actorUserId, userId, roleId }, context);
  }

  private async grant(request: RoleGrantRequest, context: RoleContext): Promise<void> {
    const { actorUserId, userId, roleId } = request;

    const role = await this.roleRepository.find(roleId);

    if (!role) throw new RoleNotFoundException(roleId);

    this.assertChangeAllowed({
      actorUserId,
      targetUserId: userId,
      roleCode: role.code,
      ...context,
    });

    if (await this.roleGrantRepository.isAssigned(userId, roleId))
      throw new RoleAlreadyAssignedException(userId, roleId);

    await this.roleGrantRepository.grant({
      userId,
      roleId,
      assignedByUserId: actorUserId,
    });

    await this.recordGrant({
      actorUserId,
      userId,
      roleId,
      action: 'grant',
    });

    context.targetRoleCodes.push(role.code);
  }

  private async getRoleContext(actorUserId: string, userId: string): Promise<RoleContext> {
    const [actorRoles, targetRoles] = await Promise.all([
      this.authorizationState.getAssignedRoles(actorUserId),
      this.authorizationState.getAssignedRoles(userId),
    ]);

    return {
      actorRoleCodes: actorRoles.map((role) => role.roleCode),
      targetRoleCodes: targetRoles.map((role) => role.roleCode),
    };
  }

  private assertChangeAllowed(context: RoleChangeContext): void {
    if (!RolePolicy.canChangeAssignment(context))
      throw new RoleGrantChangeNotAllowedException(context.targetUserId, context.roleCode);
  }

  private async recordGrant(audit: RoleGrantAudit): Promise<void> {
    await this.auditWriter.append({
      actorUserId: audit.actorUserId,
      action: `authorization.role-grant.${audit.action}`,
      module: 'authorization',
      resourceType: 'RoleGrant',
      outcome: 'CONFIRMED',
      metadata: {
        userId: audit.userId,
        roleId: audit.roleId,
      },
    });
  }
}
