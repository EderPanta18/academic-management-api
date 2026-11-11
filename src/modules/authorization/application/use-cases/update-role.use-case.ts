import { PermissionPolicy, RolePolicy } from '@authorization/domain/policies';
import {
  AUDIT_WRITER_TOKEN,
  type IAuditWriter,
  type ITransactionManager,
  TRANSACTION_MANAGER_TOKEN,
} from '@core/contracts';
import { Inject, Injectable } from '@nestjs/common';
import type { UpdateRoleCommand } from '../commands';
import {
  RoleNotFoundException,
  RolePermissionNotAssignableException,
  RolePermissionNotFoundException,
  RoleSelfEscalationException,
} from '../exceptions';
import {
  AUTHORIZATION_STATE_TOKEN,
  AUTHORIZER_TOKEN,
  type IAuthorizationState,
  type IAuthorizer,
  type IPermissionRepository,
  type IRoleRepository,
  PERMISSION_REPOSITORY_TOKEN,
  ROLE_REPOSITORY_TOKEN,
} from '../ports';

@Injectable()
export class UpdateRoleUseCase {
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

    @Inject(PERMISSION_REPOSITORY_TOKEN)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(actorUserId: string, command: UpdateRoleCommand): Promise<void> {
    await this.transactionManager.run(
      async () => {
        await this.authorizer.assertAuthorized(actorUserId, ['roles.update']);

        const role = await this.roleRepository.find(command.roleId);

        if (!role) throw new RoleNotFoundException(command.roleId);

        const updatedRole = role.update({
          name: command.name,
          description: command.description,
        });

        let permissionIds: string[] | undefined;

        if (command.permissionIds !== undefined) {
          permissionIds = [...new Set(command.permissionIds)];

          const permissions = await this.permissionRepository.findManyByIds(permissionIds);

          const foundIds = new Set(permissions.map((permission) => permission.id));
          const missingIds = permissionIds.filter((id) => !foundIds.has(id));

          if (missingIds.length > 0) throw new RolePermissionNotFoundException(missingIds);

          if (!RolePolicy.canConfigurePermissions(role, permissionIds, permissions)) {
            const reservedIds = permissions
              .filter((permission) => permission.isReserved)
              .map((permission) => permission.id);

            throw new RolePermissionNotAssignableException(reservedIds);
          }

          const assignedRoles = await this.authorizationState.getAssignedRoles(actorUserId);

          const currentEffectiveCodes = PermissionPolicy.resolveEffectivePermissions(
            assignedRoles.map((assignedRole) => assignedRole.permissions),
          );

          const actorHasRole = assignedRoles.some(
            (assignedRole) => assignedRole.roleId === command.roleId,
          );

          const proposedCodes = permissions.map((permission) => permission.code);

          if (
            RolePolicy.wouldIncreaseOwnPermissions(
              actorHasRole,
              currentEffectiveCodes,
              proposedCodes,
            )
          )
            throw new RoleSelfEscalationException(command.roleId);
        }

        await this.roleRepository.update(updatedRole, permissionIds);

        await this.auditWriter.append({
          actorUserId,
          action: 'authorization.role.update',
          resourceType: 'Role',
          resourceId: command.roleId,
          module: 'authorization',
          outcome: 'CONFIRMED',
        });
      },
      { isolation: 'SERIALIZABLE', retries: 2 },
    );
  }
}
