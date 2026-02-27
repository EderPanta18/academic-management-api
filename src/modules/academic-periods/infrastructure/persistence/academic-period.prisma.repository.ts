// modules/academic-periods/infrastructure/persistence/academic-period.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database';
import type { IAcademicPeriodFinder } from '@academic-periods/domain/ports';

@Injectable()
export class AcademicPeriodPrismaRepository implements IAcademicPeriodFinder {
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
