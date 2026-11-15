// src/modules/authorization/application/use-cases/revoke-role.use-case.ts

import {
  AUDIT_WRITER_TOKEN,
  type IAuditWriter,
  type ITransactionManager,
  TRANSACTION_MANAGER_TOKEN,
} from '@core/contracts';
import { Inject, Injectable } from '@nestjs/common';
import { RoleNotAssignedException } from '../exceptions';
import {
  AUTHORIZER_TOKEN,
  type IAuthorizer,
  type IRoleGrantRepository,
  ROLE_GRANT_REPOSITORY_TOKEN,
} from '../ports';
import { RoleAssignmentValidator } from '../validators';

@Injectable()
export class RevokeRoleUseCase {
  constructor(
    @Inject(TRANSACTION_MANAGER_TOKEN)
    private readonly transactionManager: ITransactionManager,

    @Inject(AUDIT_WRITER_TOKEN)
    private readonly auditWriter: IAuditWriter,

    @Inject(AUTHORIZER_TOKEN)
    private readonly authorizer: IAuthorizer,

    @Inject(ROLE_GRANT_REPOSITORY_TOKEN)
    private readonly roleGrantRepository: IRoleGrantRepository,

    private readonly roleAssignmentValidator: RoleAssignmentValidator,
  ) {}

  async execute(actorUserId: string, userId: string, roleId: string): Promise<void> {
    await this.transactionManager.run(
      async () => {
        await this.authorizer.assertAuthorized(actorUserId, ['role-grants.revoke']);

        await this.roleAssignmentValidator.assertChangeAllowed(actorUserId, userId, roleId);

        const revoked = await this.roleGrantRepository.revoke(userId, roleId);

        if (!revoked) throw new RoleNotAssignedException(userId, roleId);

        await this.auditWriter.append({
          actorUserId,
          action: 'authorization.role-grant.revoke',
          module: 'authorization',
          resourceType: 'RoleGrant',
          outcome: 'CONFIRMED',
          metadata: {
            userId,
            roleId,
          },
        });
      },
      { isolation: 'SERIALIZABLE', retries: 2 },
    );
  }
}
