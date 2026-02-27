// modules/courses/infrastructure/persistence/course.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/database';
import type { ICourseFinder } from '@courses/domain/ports';

@Injectable()
export class CoursePrismaRepository implements ICourseFinder {
  constructor(private readonly prisma: PrismaService) {}

  // ── ICourseFinder ────────────────────────────────────────────────────────

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.course.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }
}
