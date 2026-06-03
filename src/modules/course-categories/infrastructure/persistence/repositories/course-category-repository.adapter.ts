// modules/course-categories/infrastructure/persistence/repositories/course-category-repository.adapter.ts

import type { ICourseCategoryFinder } from '@course-categories/application/ports/in';
import { Injectable } from '@nestjs/common';
import type { PrismaService } from '@platform/database';

@Injectable()
export class CourseCategoryRepository implements ICourseCategoryFinder {
  constructor(private readonly prisma: PrismaService) {}

  // ── ICourseCategoryFinder ────────────────────────────────────────────────

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.courseCategory.count({
      where: { id, deletedAt: null },
    });

    return count > 0;
  }
}
