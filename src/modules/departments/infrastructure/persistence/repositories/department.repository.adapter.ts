// modules/departments/infrastructure/persistence/repositories/department.repository.adapter.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/persistence';
import { type IDepartmentFinder } from '@departments/domain/ports/in';

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
