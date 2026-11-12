// src/modules/authorization/infrastructure/persistence/queries/permission-query.adapter.ts

import type {
  IPermissionQuery,
  PermissionQueryFilters,
} from '@authorization/application/ports/out';
import type { PermissionReadModel } from '@authorization/application/read-models';
import type { PaginationVO } from '@core/pagination';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import { PermissionQueryMapper } from './permission-query.mapper';

@Injectable()
export class PermissionQueryAdapter implements IPermissionQuery {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    pagination: PaginationVO,
    filters?: PermissionQueryFilters,
  ): Promise<[PermissionReadModel[], number]> {
    const where: Prisma.PermissionWhereInput = {
      ...(filters?.module && {
        module: filters.module,
      }),
      isReserved: filters?.isReserved,
      ...(filters?.search && {
        OR: [
          { code: { contains: filters.search, mode: 'insensitive' } },
          { name: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [raws, total] = await Promise.all([
      this.prisma.permission.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: [{ module: 'asc' }, { code: 'asc' }],
      }),

      this.prisma.permission.count({ where }),
    ]);

    return [raws.map(PermissionQueryMapper.toReadModel), total];
  }
}
