// course-category.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database';
import { type ICourseCategoryFinder } from '@course-categories/domain/ports';

@Injectable()
export class CourseCategoryPrismaRepository implements ICourseCategoryFinder {
  constructor(private readonly prisma: PrismaService) {}

  // ── ICourseCategoryFinder ────────────────────────────────────────────────

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.courseCategory.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }
}
