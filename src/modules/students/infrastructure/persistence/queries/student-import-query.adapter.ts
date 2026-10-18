import type { PaginationVO } from '@core/pagination';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import type {
  IStudentImportQuery,
  StudentImportQueryFilters,
} from '@students/application/ports/out';
import type { StudentImportReadModel } from '@students/application/read-models';
import { StudentImportQueryMapper } from './student-import-query.mapper';

@Injectable()
export class StudentImportQuery implements IStudentImportQuery {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: string): Promise<StudentImportReadModel | null> {
    const raw = await this.prisma.studentImport.findFirst({
      where: { id },
    });

    return raw ? StudentImportQueryMapper.toReadModel(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: StudentImportQueryFilters,
  ): Promise<[StudentImportReadModel[], number]> {
    const where: Prisma.StudentImportWhereInput = {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.createdByUserId && { createdByUserId: filters.createdByUserId }),
    };

    const [raws, total] = await Promise.all([
      this.prisma.studentImport.findMany({
        where,
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),

      this.prisma.studentImport.count({ where }),
    ]);

    return [raws.map(StudentImportQueryMapper.toReadModel), total];
  }
}
