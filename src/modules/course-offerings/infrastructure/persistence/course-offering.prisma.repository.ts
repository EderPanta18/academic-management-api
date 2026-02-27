// modules/course-offerings/infrastructure/persistence/course-offering.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/database';
import { PaginationVO } from '@shared/domain/value-objects';
import { CourseOfferingStatus } from '@modules/course-offerings/domain/constants';
import { CourseOffering } from '@course-offerings/domain/entities';
import type {
  ICourseOfferingRepository,
  ICourseOfferingFinder,
} from '@course-offerings/domain/ports';
import { CourseOfferingPersistenceMapper } from '../mappers';

@Injectable()
export class CourseOfferingPrismaRepository
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
    statuses?: CourseOfferingStatus[],
  ): Promise<[CourseOffering[], number]> {
    const where: Prisma.CourseOfferingWhereInput = {
      deletedAt: null,
      ...(statuses?.length ? { status: { in: statuses } } : {}),
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

    return [
      raws.map((raw) => CourseOfferingPersistenceMapper.toDomain(raw)),
      total,
    ];
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
