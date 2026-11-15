// src/modules/authorization/infrastructure/persistence/queries/permission-query.adapter.ts

import type {
  IPermissionQuery,
  PermissionQueryFilters,
} from '@authorization/application/ports/out';
import type { PermissionReadModel } from '@authorization/application/read-models';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import { PermissionQueryMapper } from './permission-query.mapper';

@Injectable()
export class PermissionQueryAdapter implements IPermissionQuery {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters?: PermissionQueryFilters): Promise<PermissionReadModel[]> {
    const where: Prisma.PermissionWhereInput = {
      module: filters?.module,
      isReserved: filters?.isReserved,
      ...(filters?.search && {
        OR: [
          { code: { contains: filters.search, mode: 'insensitive' } },
          { name: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const raws = await this.prisma.permission.findMany({
      where,
      orderBy: [{ module: 'asc' }, { code: 'asc' }],
    });

    return raws.map(PermissionQueryMapper.toReadModel);
  }
}
