// src/modules/authorization/infrastructure/persistence/repositories/permission-repository.adapter.ts

import type { IPermissionRepository } from '@authorization/application/ports/out';
import type { Permission } from '@authorization/domain/models';
import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@platform/database';
import { PermissionRepositoryMapper } from './permission-repository.mapper';

@Injectable()
export class PermissionRepositoryAdapter implements IPermissionRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async findManyByIds(ids: string[]): Promise<Permission[]> {
    if (ids.length === 0) return [];

    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const raws = await db.permission.findMany({
      where: {
        id: { in: ids },
      },
    });

    return raws.map(PermissionRepositoryMapper.toDomain);
  }

  async findManyByCodes(codes: string[]): Promise<Permission[]> {
    if (codes.length === 0) return [];

    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const raws = await db.permission.findMany({
      where: {
        code: { in: codes },
      },
    });

    return raws.map(PermissionRepositoryMapper.toDomain);
  }
}
