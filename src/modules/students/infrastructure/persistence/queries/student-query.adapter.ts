import type { PaginationVO } from '@core/pagination';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import type { IStudentQuery, StudentQueryFilters } from '@students/application/ports/out';
import type { StudentReadModel } from '@students/application/read-models';
import { StudentQueryMapper } from './student-query.mapper';

@Injectable()
export class StudentQuery implements IStudentQuery {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: string): Promise<StudentReadModel | null> {
    const raw = await this.prisma.student.findFirst({
      where: {
        id,
        deletedAt: null,
        person: { deletedAt: null },
      },
      include: { person: { include: { documentType: true } } },
    });

    return raw ? StudentQueryMapper.toReadModel(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: StudentQueryFilters,
  ): Promise<[StudentReadModel[], number]> {
    const where: Prisma.StudentWhereInput = {
      deletedAt: null,
      person: { deletedAt: null },
      ...(filters?.academicProgramId && {
        academicProgramId: filters.academicProgramId,
      }),
      ...(filters?.status && { status: filters.status }),
      ...(filters?.search && {
        OR: [
          { code: { contains: filters.search, mode: 'insensitive' } },
          { institutionalEmail: { contains: filters.search, mode: 'insensitive' } },
          { person: { documentNumber: { contains: filters.search, mode: 'insensitive' } } },
          { person: { firstName: { contains: filters.search, mode: 'insensitive' } } },
          { person: { lastName: { contains: filters.search, mode: 'insensitive' } } },
          { person: { email: { contains: filters.search, mode: 'insensitive' } } },
        ],
      }),
    };

    const [raws, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        include: { person: { include: { documentType: true } } },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { person: { lastName: 'asc' } },
      }),

      this.prisma.student.count({ where }),
    ]);

    return [raws.map(StudentQueryMapper.toReadModel), total];
  }
}
