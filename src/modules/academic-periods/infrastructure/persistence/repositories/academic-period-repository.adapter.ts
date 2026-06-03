// modules/academic-periods/infrastructure/persistence/repositories/academic-period-repository.adapter.ts

import type { IAcademicPeriodFinder } from '@academic-periods/application/ports/in';
import { Injectable } from '@nestjs/common';
import type { PrismaService } from '@platform/database';

@Injectable()
export class AcademicPeriodRepository implements IAcademicPeriodFinder {
  constructor(private readonly prisma: PrismaService) {}

  // ── IAcademicPeriodFinder ────────────────────────────────────────────────

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.academicPeriod.count({
      where: { id, deletedAt: null },
    });

    return count > 0;
  }

  async isCurrent(id: number): Promise<boolean> {
    const count = await this.prisma.academicPeriod.count({
      where: { id, isCurrent: true, deletedAt: null },
    });

    return count > 0;
  }
}
