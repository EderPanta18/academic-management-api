import type { PaginationVO } from '@core/pagination';
import type { EnrollmentQueryFilters, IEnrollmentQuery } from '@enrollments/application/ports/out';
import type { EnrollmentReadModel } from '@enrollments/application/read-models';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import { EnrollmentQueryMapper } from './enrollment-query.mapper';

@Injectable()
export class EnrollmentQuery implements IEnrollmentQuery {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: string): Promise<EnrollmentReadModel | null> {
    const raw = await this.prisma.enrollment.findFirst({
      where: { id, deletedAt: null },
      include: this.includeRelations(),
    });

    return raw ? EnrollmentQueryMapper.toReadModel(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: EnrollmentQueryFilters,
  ): Promise<[EnrollmentReadModel[], number]> {
    const where: Prisma.EnrollmentWhereInput = {
      deletedAt: null,
      ...(filters?.studentId && { studentId: filters.studentId }),
      ...(filters?.courseOfferingId && {
        courseOfferingId: filters.courseOfferingId,
      }),
      ...(filters?.academicPeriodId && {
        courseOffering: { academicPeriodId: filters.academicPeriodId },
      }),
      ...(filters?.statuses?.length && { status: { in: filters.statuses } }),
      ...(filters?.search && {
        OR: [
          { student: { code: { contains: filters.search, mode: 'insensitive' } } },
          {
            student: {
              person: {
                firstName: { contains: filters.search, mode: 'insensitive' },
              },
            },
          },
          {
            student: {
              person: {
                lastName: { contains: filters.search, mode: 'insensitive' },
              },
            },
          },
          {
            courseOffering: {
              course: { code: { contains: filters.search, mode: 'insensitive' } },
            },
          },
          {
            courseOffering: {
              course: { name: { contains: filters.search, mode: 'insensitive' } },
            },
          },
          {
            courseOffering: {
              academicPeriod: {
                code: { contains: filters.search, mode: 'insensitive' },
              },
            },
          },
        ],
      }),
    };

    const [raws, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where,
        include: this.includeRelations(),
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { enrolledAt: 'desc' },
      }),

      this.prisma.enrollment.count({ where }),
    ]);

    return [raws.map(EnrollmentQueryMapper.toReadModel), total];
  }

  private includeRelations() {
    return {
      student: { include: { person: true } },
      courseOffering: {
        include: {
          course: true,
          academicPeriod: true,
        },
      },
      registeredByUser: true,
    } as const;
  }
}
