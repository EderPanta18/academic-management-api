// src/modules/authorization/infrastructure/persistence/repositories/role-grant-repository.adapter.ts

import type { IRoleGrantRepository, RoleGrant } from '@authorization/application/ports/out';
import { SystemException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';

@Injectable()
export class RoleGrantRepositoryAdapter implements IRoleGrantRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterPrisma>) {}

  async grant(grant: RoleGrant): Promise<boolean> {
    this.assertTransactionActive();

    const result = await this.txHost.tx.userRole.createMany({
      data: [
        {
          userId: grant.userId,
          roleId: grant.roleId,
          assignedByUserId: grant.assignedByUserId,
        },
      ],
      skipDuplicates: true,
    });

    return result.count === 1;
  }

  async revoke(userId: string, roleId: string): Promise<boolean> {
    this.assertTransactionActive();

    const result = await this.txHost.tx.userRole.deleteMany({
      where: {
        userId,
        roleId,
      },
    });

    return result.count === 1;
  }

  private assertTransactionActive(): void {
    if (!this.txHost.isTransactionActive())
      throw new SystemException(
        'La modificación de asignaciones de roles requiere una transacción activa.',
      );
  }
}
