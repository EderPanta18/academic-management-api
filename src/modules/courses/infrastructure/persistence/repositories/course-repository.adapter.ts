import type { ICourseRepository } from '@courses/application/ports/out';
import type { Course } from '@courses/domain/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import { CourseRepositoryMapper } from './course-repository.mapper';

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(course: Course): Promise<Course> {
    const data = CourseRepositoryMapper.toPersistence(course);

    const raw = await this.prisma.course.create({ data });

    return CourseRepositoryMapper.toDomain(raw);
  }

  async find(id: string): Promise<Course | null> {
    const raw = await this.prisma.course.findFirst({
      where: {
        id,
        deletedAt: null,
        academicProgram: { deletedAt: null },
      },
    });

    return raw ? CourseRepositoryMapper.toDomain(raw) : null;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.course.count({
      where: {
        id,
        deletedAt: null,
        academicProgram: { deletedAt: null },
      },
    });

    return count > 0;
  }

  async existsByProgramAndCode(academicProgramId: string, code: string): Promise<boolean> {
    const count = await this.prisma.course.count({
      where: {
        academicProgramId,
        code,
        deletedAt: null,
      },
    });

    return count > 0;
  }
}
