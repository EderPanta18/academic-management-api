// modules/careers/infrastructure/persistence/repositories/career.repository.adapter.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/persistence';
import { type ICareerFinder } from '@careers/domain/ports/in';

@Injectable()
export class CareerRepository implements ICareerFinder {
  constructor(private readonly prisma: PrismaService) {}

  // ── ICareerFinder --------------------------------------------------------

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.career.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }
}
