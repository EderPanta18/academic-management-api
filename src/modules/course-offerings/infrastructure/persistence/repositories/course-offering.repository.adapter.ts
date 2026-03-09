// modules/course-offerings/infrastructure/persistence/repositories/course-offering.repository.adapter.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationVO } from '@core/domain/value-objects';
import { PrismaService } from '@shared/infrastructure/persistence';
import { CourseOfferingStatus } from '@course-offerings/domain/constants';
import { CourseOffering } from '@course-offerings/domain/entities';
import { type ICourseOfferingFinder } from '@course-offerings/domain/ports/in';
import type {
  ICourseOfferingRepository,
  FindAllCourseOfferingsFilters,
} from '@course-offerings/domain/ports/out';
import { CourseOfferingPersistenceMapper } from '../mappers';

@Injectable()
export class CourseOfferingRepository
  implements ICourseOfferingRepository, ICourseOfferingFinder
{
  constructor(private readonly prisma: PrismaService) {}

  // ── ICourseOfferingRepository ─────────────────────────────────────────────

  async save(offering: CourseOffering): Promise<CourseOffering> {
    return offering.id !== undefined
      ? this.update(offering)
      : this.create(offering);
  }

  async findById(id: number): Promise<CourseOffering | null> {
    const raw = await this.prisma.courseOffering.findFirst({
      where: { id, deletedAt: null },
    });

    return raw ? CourseOfferingPersistenceMapper.toDomain(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: FindAllCourseOfferingsFilters,
  ): Promise<[CourseOffering[], number]> {
    const where: Prisma.CourseOfferingWhereInput = {
      deletedAt: null,
      ...(filters?.courseId ? { courseId: filters.courseId } : {}),
      ...(filters?.academicPeriodId
        ? { academicPeriodId: filters.academicPeriodId }
        : {}),
      ...(filters?.statuses?.length
        ? { status: { in: filters.statuses } }
        : {}),
    };

    const [raws, total] = await Promise.all([
      this.prisma.courseOffering.findMany({
        where,
        skip: pagination.offset,
        take: pagination.pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.courseOffering.count({ where }),
    ]);

    return [raws.map(CourseOfferingPersistenceMapper.toDomain), total];
  }

  async assignProfessor(
    offeringId: number,
    professorId: number,
  ): Promise<CourseOffering> {
    const raw = await this.prisma.courseOffering.update({
      where: { id: offeringId },
      data: { professorId },
    });

    return CourseOfferingPersistenceMapper.toDomain(raw);
  }

  async activate(id: number): Promise<CourseOffering> {
    const raw = await this.prisma.courseOffering.update({
      where: { id },
      data: { status: CourseOfferingStatus.ACTIVE },
    });
    return CourseOfferingPersistenceMapper.toDomain(raw);
  }

  async existsByCourseAndPeriodAndSection(
    courseId: number,
    academicPeriodId: number,
    section: string,
  ): Promise<boolean> {
    const count = await this.prisma.courseOffering.count({
      where: { courseId, academicPeriodId, section, deletedAt: null },
    });
    return count > 0;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.courseOffering.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ── ICourseOfferingFinder ─────────────────────────────────────────────────

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.courseOffering.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }

  async isOpenForEnrollment(id: number): Promise<boolean> {
    const raw = await this.prisma.courseOffering.findFirst({
      where: { id, deletedAt: null },
      select: { status: true, enrollmentDeadline: true },
    });

    if (!raw) return false;

    // Delega la regla de negocio a la entidad reconstituida
    const offering = CourseOffering.reconstitute({
      id,
      courseId: 0,
      academicPeriodId: 0,
      professorId: null,
      section: '',
      maxStudents: 0,
      enrollmentDeadline: raw.enrollmentDeadline,
      status: raw.status as any,
    });

    return offering.isOpenForEnrollment;
  }

  async getCourseCareerIdByOfferingId(
    offeringId: number,
  ): Promise<number | null> {
    const raw = await this.prisma.courseOffering.findFirst({
      where: { id: offeringId, deletedAt: null },
      select: {
        course: { select: { careerId: true } },
      },
    });
    return raw?.course.careerId ?? null;
  }

  // ── Privados ──────────────────────────────────────────────────────────────

  private async create(offering: CourseOffering): Promise<CourseOffering> {
    const data = CourseOfferingPersistenceMapper.toPersistence(offering);

    const raw = await this.prisma.courseOffering.create({ data });

    return CourseOfferingPersistenceMapper.toDomain(raw);
  }

  private async update(offering: CourseOffering): Promise<CourseOffering> {
    const data = CourseOfferingPersistenceMapper.toPersistence(offering);

    const raw = await this.prisma.courseOffering.update({
      where: { id: offering.id },
      data,
    });

    return CourseOfferingPersistenceMapper.toDomain(raw);
  }
}
