// modules/enrollments/infrastructure/persistence/repositories/enrollment.repository.adapter.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationVO } from '@core/pagination';
import { PrismaService } from '@platform/database';
import { EnrollmentStatus } from '@enrollments/domain/constants';
import {
  Enrollment,
  type EnrollmentStatusLogProps,
} from '@enrollments/domain/entities';
import { type IEnrollmentFinder } from '@enrollments/domain/ports/in';
import type {
  IEnrollmentRepository,
  ChangeEnrollmentStatusProps,
  FindAllEnrollmentsFilters,
} from '@enrollments/domain/ports/out';
import { EnrollmentPersistenceMapper } from '../mappers';

@Injectable()
export class EnrollmentRepository
  implements IEnrollmentRepository, IEnrollmentFinder
{
  constructor(private readonly prisma: PrismaService) {}

  // ── IEnrollmentRepository ─────────────────────────────────────────────────

  async save(enrollment: Enrollment): Promise<Enrollment> {
    const data = EnrollmentPersistenceMapper.toPersistence(enrollment);
    const raw = await this.prisma.enrollment.create({ data });
    return EnrollmentPersistenceMapper.toDomain(raw);
  }

  async findById(id: number): Promise<Enrollment | null> {
    const raw = await this.prisma.enrollment.findFirst({
      where: { id, deletedAt: null },
    });
    return raw ? EnrollmentPersistenceMapper.toDomain(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: FindAllEnrollmentsFilters,
  ): Promise<[Enrollment[], number]> {
    const where: Prisma.EnrollmentWhereInput = {
      deletedAt: null,
      ...(filters?.studentId && { studentId: filters.studentId }),
      ...(filters?.courseOfferingId && {
        courseOfferingId: filters.courseOfferingId,
      }),
      ...(filters?.statuses?.length && { status: { in: filters.statuses } }),
    };

    const [raws, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where,
        skip: pagination.offset,
        take: pagination.pageSize,
        orderBy: { id: 'asc' },
      }),
      this.prisma.enrollment.count({ where }),
    ]);

    return [raws.map(EnrollmentPersistenceMapper.toDomain), total];
  }

  async changeStatus(props: ChangeEnrollmentStatusProps): Promise<Enrollment> {
    const { enrollmentId, previousStatus, newStatus, reason, changedBy } =
      props;

    return this.prisma.$transaction(async (tx) => {
      // Primero el log — si falla, el update no ocurre
      await tx.enrollmentStatusLog.create({
        data: { enrollmentId, previousStatus, newStatus, reason, changedBy },
      });

      const raw = await tx.enrollment.update({
        where: { id: enrollmentId },
        data: { status: newStatus },
      });

      return EnrollmentPersistenceMapper.toDomain(raw);
    });
  }

  async findStatusLogByEnrollmentId(
    enrollmentId: number,
  ): Promise<EnrollmentStatusLogProps[]> {
    const raws = await this.prisma.enrollmentStatusLog.findMany({
      where: { enrollmentId },
      orderBy: { createdAt: 'asc' },
    });
    return raws.map(EnrollmentPersistenceMapper.statusLogToDomain);
  }

  async existsByStudentAndOffering(
    studentId: number,
    courseOfferingId: number,
  ): Promise<boolean> {
    const count = await this.prisma.enrollment.count({
      where: { studentId, courseOfferingId, deletedAt: null },
    });
    return count > 0;
  }

  async isAtCapacity(courseOfferingId: number): Promise<boolean> {
    // Dos queries independientes son más legibles que un raw SQL JOIN.
    // Si offering no existe o fue soft-deleted, no puede estar al límite.
    const offering = await this.prisma.courseOffering.findFirst({
      where: { id: courseOfferingId, deletedAt: null },
      select: { maxStudents: true },
    });
    if (!offering) return false;

    const enrolledCount = await this.prisma.enrollment.count({
      where: {
        courseOfferingId,
        status: EnrollmentStatus.ENROLLED,
        deletedAt: null,
      },
    });

    return enrolledCount >= offering.maxStudents;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.enrollment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ── IEnrollmentFinder ─────────────────────────────────────────────────────

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.enrollment.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }

  async isEnrolledAndActive(id: number): Promise<boolean> {
    const count = await this.prisma.enrollment.count({
      where: { id, status: EnrollmentStatus.ENROLLED, deletedAt: null },
    });
    return count > 0;
  }
}
