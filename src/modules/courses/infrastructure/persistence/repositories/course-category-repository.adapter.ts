import type { ICourseCategoryRepository } from '@courses/application/ports/out';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';

@Injectable()
export class CourseCategoryRepository implements ICourseCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.courseCategory.count({
      where: { id, deletedAt: null },
    });

    return count > 0;
  }
}
