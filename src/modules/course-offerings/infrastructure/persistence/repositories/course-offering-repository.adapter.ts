import type { ICourseOfferingRepository } from '@course-offerings/application/ports/out';
import type { CourseOffering } from '@course-offerings/domain/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import { CourseOfferingRepositoryMapper } from './course-offering-repository.mapper';

@Injectable()
export class CourseOfferingRepository implements ICourseOfferingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(offering: CourseOffering): Promise<CourseOffering> {
    const data = CourseOfferingRepositoryMapper.toPersistence(offering);

    const raw = await this.prisma.courseOffering.create({ data });

    return CourseOfferingRepositoryMapper.toDomain(raw);
  }

  async update(offering: CourseOffering): Promise<CourseOffering> {
    const data = CourseOfferingRepositoryMapper.toPersistence(offering);

    const raw = await this.prisma.courseOffering.update({
      where: { id: offering.id },
      data,
    });

    return CourseOfferingRepositoryMapper.toDomain(raw);
  }

  async find(id: string): Promise<CourseOffering | null> {
    const raw = await this.prisma.courseOffering.findFirst({
      where: {
        id,
        deletedAt: null,
        course: { deletedAt: null },
        academicPeriod: { deletedAt: null },
      },
    });

    return raw ? CourseOfferingRepositoryMapper.toDomain(raw) : null;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.courseOffering.count({
      where: {
        id,
        deletedAt: null,
        course: { deletedAt: null },
        academicPeriod: { deletedAt: null },
      },
    });

    return count > 0;
  }

  async existsByCoursePeriodAndSection(
    courseId: string,
    academicPeriodId: string,
    section: string,
  ): Promise<boolean> {
    const count = await this.prisma.courseOffering.count({
      where: {
        courseId,
        academicPeriodId,
        section,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async countActiveEnrollments(courseOfferingId: string): Promise<number> {
    return this.prisma.enrollment.count({
      where: {
        courseOfferingId,
        status: 'ENROLLED',
        deletedAt: null,
      },
    });
  }
}
