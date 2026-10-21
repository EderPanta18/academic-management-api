import type { IEnrollmentStatusLogQuery } from '@enrollments/application/ports/out';
import type { EnrollmentStatusLogReadModel } from '@enrollments/application/read-models';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import { EnrollmentStatusLogQueryMapper } from './enrollment-status-log-query.mapper';

@Injectable()
export class EnrollmentStatusLogQuery implements IEnrollmentStatusLogQuery {
  constructor(private readonly prisma: PrismaService) {}

  async findByEnrollmentId(enrollmentId: string): Promise<EnrollmentStatusLogReadModel[]> {
    const raws = await this.prisma.enrollmentStatusLog.findMany({
      where: { enrollmentId },
      include: { changedByUser: true },
      orderBy: { createdAt: 'asc' },
    });

    return raws.map(EnrollmentStatusLogQueryMapper.toReadModel);
  }
}
