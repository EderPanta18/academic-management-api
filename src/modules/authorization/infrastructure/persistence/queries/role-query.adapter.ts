// src/modules/authorization/infrastructure/persistence/queries/role-query.adapter.ts

import type { IRoleQuery, RoleQueryFilters } from '@authorization/application/ports/out';
import type {
  RoleDetailReadModel,
  RoleReadModel,
  RoleUserReadModel,
} from '@authorization/application/read-models';
import type { PaginationVO } from '@core/pagination';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import { RoleQueryMapper } from './role-query.mapper';

@Injectable()
export class RoleQueryAdapter implements IRoleQuery {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: string): Promise<RoleDetailReadModel | null> {
    const raw = await this.prisma.role.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        rolePermissions: {
          orderBy: { permissionId: 'asc' },
        },
      },
    });

    return raw ? RoleQueryMapper.toDetailReadModel(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: RoleQueryFilters,
  ): Promise<[RoleReadModel[], number]> {
    const where: Prisma.RoleWhereInput = {
      deletedAt: null,
      isSystem: filters?.isSystem,
      ...(filters?.search && {
        OR: [
          { code: { contains: filters.search, mode: 'insensitive' } },
          { name: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [raws, total] = await Promise.all([
      this.prisma.role.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: [{ code: 'asc' }, { id: 'asc' }],
      }),

      this.prisma.role.count({ where }),
    ]);

    return [raws.map(RoleQueryMapper.toReadModel), total];
  }

  async findRoleUsers(
    roleId: string,
    pagination: PaginationVO,
  ): Promise<[RoleUserReadModel[], number]> {
    const where: Prisma.UserRoleWhereInput = {
      roleId,
      role: { deletedAt: null },
    };

    const [raws, total] = await Promise.all([
      this.prisma.userRole.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: [{ assignedAt: 'desc' }, { userId: 'asc' }],
      }),

      this.prisma.userRole.count({ where }),
    ]);

    return [raws.map(RoleQueryMapper.toUserReadModel), total];
  }
}
