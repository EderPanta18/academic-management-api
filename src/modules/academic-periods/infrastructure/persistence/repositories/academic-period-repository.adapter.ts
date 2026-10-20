import type { IAcademicPeriodRepository } from '@academic-periods/application/ports/out';
import type { AcademicPeriod } from '@academic-periods/domain/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import { AcademicPeriodRepositoryMapper } from './academic-period-repository.mapper';

@Injectable()
export class AcademicPeriodRepository implements IAcademicPeriodRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(period: AcademicPeriod): Promise<AcademicPeriod> {
    const data = AcademicPeriodRepositoryMapper.toPersistence(period);

    const raw = await this.prisma.academicPeriod.create({ data });

    return AcademicPeriodRepositoryMapper.toDomain(raw);
  }

  async update(period: AcademicPeriod): Promise<AcademicPeriod> {
    const data = AcademicPeriodRepositoryMapper.toPersistence(period);

    const raw = await this.prisma.academicPeriod.update({
      where: { id: period.id },
      data,
    });

    return AcademicPeriodRepositoryMapper.toDomain(raw);
  }

  async find(id: string): Promise<AcademicPeriod | null> {
    const raw = await this.prisma.academicPeriod.findFirst({
      where: { id, deletedAt: null },
    });

    return raw ? AcademicPeriodRepositoryMapper.toDomain(raw) : null;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.academicPeriod.count({
      where: { id, deletedAt: null },
    });

    return count > 0;
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.prisma.academicPeriod.count({
      where: { code, deletedAt: null },
    });

    return count > 0;
  }
}
