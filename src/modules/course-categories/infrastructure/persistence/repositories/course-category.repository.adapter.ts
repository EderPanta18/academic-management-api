// modules/course-categories/infrastructure/persistence/repositories/course-category.repository.adapter.ts

import { Injectable } from "@nestjs/common";

import { PrismaService } from "@platform/database";
import type { ICourseCategoryFinder } from "@modules/course-categories/application/ports/in";

@Injectable()
export class CourseCategoryRepository implements ICourseCategoryFinder {
  constructor(private readonly prisma: PrismaService) {}

  // ── ICourseCategoryFinder ────────────────────────────────────────────────

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.courseCategory.count({
      where: { id, deletedAt: null }
    });

    return count > 0;
  }
}
