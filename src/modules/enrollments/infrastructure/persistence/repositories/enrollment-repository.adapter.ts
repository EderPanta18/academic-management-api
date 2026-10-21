import type { IEnrollmentRepository } from '@enrollments/application/ports/out';
import type { Enrollment } from '@enrollments/domain/entities';
import type { EnrollmentStatusLog } from '@enrollments/domain/records';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import { EnrollmentRepositoryMapper } from './enrollment-repository.mapper';

@Injectable()
export class EnrollmentRepository implements IEnrollmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(enrollment: Enrollment): Promise<Enrollment> {
    const data = EnrollmentRepositoryMapper.toCreatePersistence(enrollment);

    const raw = await this.prisma.enrollment.create({ data });

    return EnrollmentRepositoryMapper.toDomain(raw);
  }

  async find(id: string): Promise<Enrollment | null> {
    const raw = await this.prisma.enrollment.findFirst({
      where: { id, deletedAt: null },
    });

    return raw ? EnrollmentRepositoryMapper.toDomain(raw) : null;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.enrollment.count({
      where: { id, deletedAt: null },
    });

    return count > 0;
  }

  async existsByStudentAndOffering(studentId: string, courseOfferingId: string): Promise<boolean> {
    const count = await this.prisma.enrollment.count({
      where: { studentId, courseOfferingId, deletedAt: null },
    });

    return count > 0;
  }

  async updateWithStatusLog(enrollment: Enrollment, log: EnrollmentStatusLog): Promise<Enrollment> {
    const enrollmentData = EnrollmentRepositoryMapper.toUpdatePersistence(enrollment);
    const logData = EnrollmentRepositoryMapper.logToPersistence(log);

    const raw = await this.prisma.$transaction(async (tx) => {
      await tx.enrollment.update({
        where: { id: enrollment.id },
        data: enrollmentData,
      });

      await tx.enrollmentStatusLog.create({ data: logData });

      return tx.enrollment.findUniqueOrThrow({
        where: { id: enrollment.id },
      });
    });

    return EnrollmentRepositoryMapper.toDomain(raw);
  }
}
