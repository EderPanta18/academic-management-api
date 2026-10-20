import type { PaginationVO } from '@core/pagination';
import type {
  CourseOfferingQueryFilters,
  ICourseOfferingQuery,
} from '@course-offerings/application/ports/out';
import type { CourseOfferingReadModel } from '@course-offerings/application/read-models';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import { CourseOfferingQueryMapper } from './course-offering-query.mapper';

@Injectable()
export class CourseOfferingQuery implements ICourseOfferingQuery {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: string): Promise<CourseOfferingReadModel | null> {
    const raw = await this.prisma.courseOffering.findFirst({
      where: {
        id,
        deletedAt: null,
        course: { deletedAt: null },
        academicPeriod: { deletedAt: null },
      },
      include: {
        course: true,
        academicPeriod: true,
        professor: { include: { person: true } },
      },
    });

    return raw ? CourseOfferingQueryMapper.toReadModel(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: CourseOfferingQueryFilters,
  ): Promise<[CourseOfferingReadModel[], number]> {
    const where: Prisma.CourseOfferingWhereInput = {
      deletedAt: null,
      course: { deletedAt: null },
      academicPeriod: { deletedAt: null },
      ...(filters?.courseId && { courseId: filters.courseId }),
      ...(filters?.academicPeriodId && {
        academicPeriodId: filters.academicPeriodId,
      }),
      ...(filters?.professorId && { professorId: filters.professorId }),
      ...(filters?.statuses?.length && { status: { in: filters.statuses } }),
      ...(filters?.search && {
        OR: [
          { section: { contains: filters.search, mode: 'insensitive' } },
          {
            course: {
              code: { contains: filters.search, mode: 'insensitive' },
            },
          },
          {
            course: {
              name: { contains: filters.search, mode: 'insensitive' },
            },
          },
          {
            academicPeriod: {
              code: { contains: filters.search, mode: 'insensitive' },
            },
          },
        ],
      }),
    };

    const [raws, total] = await Promise.all([
      this.prisma.courseOffering.findMany({
        where,
        include: {
          course: true,
          academicPeriod: true,
          professor: { include: { person: true } },
        },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: [
          { academicPeriod: { startDate: 'desc' } },
          { course: { code: 'asc' } },
          { section: 'asc' },
        ],
      }),

      this.prisma.courseOffering.count({ where }),
    ]);

    return [raws.map(CourseOfferingQueryMapper.toReadModel), total];
  }
}
