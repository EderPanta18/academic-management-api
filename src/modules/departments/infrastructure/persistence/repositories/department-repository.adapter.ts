// modules/departments/infrastructure/persistence/repositories/department-repository.adapter.ts

import type { IDepartmentFinder } from '@departments/application/ports/in';
import { Injectable } from '@nestjs/common';
import type { PrismaService } from '@platform/database';

@Injectable()
export class DepartmentRepository implements IDepartmentFinder {
  constructor(private readonly prisma: PrismaService) {}

  // ── IDepartmentFinder ----------------------------------------------------

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.department.count({
      where: { id, deletedAt: null },
    });

    return count > 0;
  }
}
