// src/modules/authorization/infrastructure/persistence/state/authorization-state.adapter.ts

import type {
  AssignedRoleAuthorizationState,
  IAuthorizationState,
} from '@authorization/application/ports/out';
import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@platform/database';
import { AuthorizationStateMapper } from './authorization-state.mapper';

@Injectable()
export class AuthorizationStateAdapter implements IAuthorizationState {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async getAssignedRoles(userId: string): Promise<AssignedRoleAuthorizationState[]> {
    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const raws = await db.userRole.findMany({
      where: {
        userId,
        role: {
          deletedAt: null,
        },
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
      orderBy: [{ roleId: 'asc' }],
    });

    return raws.map(AuthorizationStateMapper.toState);
  }
}
