// src/modules/authorization/infrastructure/persistence/repositories/role-repository.adapter.ts

import type { IRoleRepository } from '@authorization/application/ports/out';
import type { Role } from '@authorization/domain/entities';
import { SystemException } from '@core/exceptions';
import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { PrismaService } from '@platform/database';
import { Prisma } from '@prisma/client';
import { RoleRepositoryMapper } from './role-repository.mapper';

@Injectable()
export class RoleRepositoryAdapter implements IRoleRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  async create(role: Role, permissionIds: string[]): Promise<Role> {
    this.assertTransactionActive();

    const raw = await this.txHost.tx.role.create({
      data: {
        id: role.id,
        code: role.code,
        name: role.name,
        description: role.description,
        isSystem: role.isSystem,
      },
    });

    if (permissionIds.length > 0)
      await this.txHost.tx.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId: role.id,
          permissionId,
        })),
      });

    return RoleRepositoryMapper.toDomain(raw);
  }

  async update(role: Role, permissionIds?: string[]): Promise<Role> {
    this.assertTransactionActive();

    const raw = await this.txHost.tx.role.update({
      where: {
        id: role.id,
        deletedAt: null,
      },
      data: {
        name: role.name,
        description: role.description,
      },
    });

    if (permissionIds !== undefined) {
      await this.txHost.tx.rolePermission.deleteMany({
        where: { roleId: role.id },
      });

      if (permissionIds.length > 0)
        await this.txHost.tx.rolePermission.createMany({
          data: permissionIds.map((permissionId) => ({
            roleId: role.id,
            permissionId,
          })),
        });
    }

    return RoleRepositoryMapper.toDomain(raw);
  }

  async find(id: string): Promise<Role | null> {
    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const raw = await db.role.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return raw ? RoleRepositoryMapper.toDomain(raw) : null;
  }

  async findManyByIds(ids: string[]): Promise<Role[]> {
    if (ids.length === 0) return [];

    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const raw = await db.role.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
      },
    });

    return raw.map(RoleRepositoryMapper.toDomain);
  }

  async existsByCode(code: string): Promise<boolean> {
    const db = this.txHost.isTransactionActive() ? this.txHost.tx : this.prisma;

    const result = await db.$queryRaw<{ exists: boolean }[]>(Prisma.sql`
      SELECT EXISTS (
        SELECT 1
        FROM "roles"
        WHERE "deletedAt" IS NULL
          AND lower(btrim("code")) = lower(btrim(${code}))
      ) AS "exists"
    `);

    return result[0]?.exists ?? false;
  }

  private assertTransactionActive(): void {
    if (!this.txHost.isTransactionActive())
      throw new SystemException('La modificación de roles requiere una transacción activa.');
  }
}
