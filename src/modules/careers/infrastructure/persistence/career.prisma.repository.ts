// modules/careers/infrastructure/persistence/career.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database';
import { type ICareerFinder } from '@careers/domain/ports';

@Injectable()
export class CareerPrismaRepository implements ICareerFinder {
  constructor(private readonly prisma: PrismaService) {}

  // ── ICareerFinder --------────────────────────────────────────────────────

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.career.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }
}
