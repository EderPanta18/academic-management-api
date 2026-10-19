import type { PaginationVO } from '@core/pagination';
import type { CourseQueryFilters, ICourseQuery } from '@courses/application/ports/out';
import type { CourseReadModel } from '@courses/application/read-models';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import { CourseQueryMapper } from './course-query.mapper';

@Injectable()
export class CourseQuery implements ICourseQuery {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: string): Promise<CourseReadModel | null> {
    const raw = await this.prisma.course.findFirst({
      where: {
        id,
        deletedAt: null,
        academicProgram: { deletedAt: null },
      },
      include: {
        academicProgram: true,
        courseCategory: true,
      },
    });

    return raw ? CourseQueryMapper.toReadModel(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: CourseQueryFilters,
  ): Promise<[CourseReadModel[], number]> {
    const where: Prisma.CourseWhereInput = {
      deletedAt: null,
      academicProgram: { deletedAt: null },
      ...(filters?.academicProgramId && {
        academicProgramId: filters.academicProgramId,
      }),
      ...(filters?.courseCategoryId && {
        courseCategoryId: filters.courseCategoryId,
      }),
      ...(filters?.search && {
        OR: [
          { code: { contains: filters.search, mode: 'insensitive' } },
          { name: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [raws, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        include: {
          academicProgram: true,
          courseCategory: true,
        },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: [{ academicProgramId: 'asc' }, { code: 'asc' }],
      }),

      this.prisma.course.count({ where }),
    ]);

    return [raws.map(CourseQueryMapper.toReadModel), total];
  }
}
