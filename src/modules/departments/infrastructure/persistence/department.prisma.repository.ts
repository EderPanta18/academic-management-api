// modules/departments/infrastructure/persistence/department.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database';
import { type IDepartmentFinder } from '@departments/domain/ports';

@Injectable()
export class DepartmentPrismaRepository implements IDepartmentFinder {
  constructor(private readonly prisma: PrismaService) {}

  // ── IDepartmentFinder ----────────────────────────────────────────────────

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.department.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }
}
