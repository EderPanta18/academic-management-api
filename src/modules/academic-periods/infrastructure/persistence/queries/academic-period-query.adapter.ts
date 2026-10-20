import type {
  AcademicPeriodQueryFilters,
  IAcademicPeriodQuery,
} from '@academic-periods/application/ports/out';
import type { AcademicPeriodReadModel } from '@academic-periods/application/read-models';
import type { PaginationVO } from '@core/pagination';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import { AcademicPeriodQueryMapper } from './academic-period-query.mapper';

@Injectable()
export class AcademicPeriodQuery implements IAcademicPeriodQuery {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: string): Promise<AcademicPeriodReadModel | null> {
    const raw = await this.prisma.academicPeriod.findFirst({
      where: { id, deletedAt: null },
    });

    return raw ? AcademicPeriodQueryMapper.toReadModel(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: AcademicPeriodQueryFilters,
  ): Promise<[AcademicPeriodReadModel[], number]> {
    const where: Prisma.AcademicPeriodWhereInput = {
      deletedAt: null,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && {
        OR: [
          { code: { contains: filters.search, mode: 'insensitive' } },
          { name: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [raws, total] = await Promise.all([
      this.prisma.academicPeriod.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { startDate: 'desc' },
      }),

      this.prisma.academicPeriod.count({ where }),
    ]);

    return [raws.map(AcademicPeriodQueryMapper.toReadModel), total];
  }
}
