import type { PaginationVO } from '@core/pagination';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import type { IProfessorQuery, ProfessorQueryFilters } from '@professors/application/ports/out';
import type { ProfessorReadModel } from '@professors/application/read-models';
import { ProfessorQueryMapper } from './professor-query.mapper';

@Injectable()
export class ProfessorQuery implements IProfessorQuery {
  constructor(private readonly prisma: PrismaService) {}

  async find(id: string): Promise<ProfessorReadModel | null> {
    const raw = await this.prisma.professor.findFirst({
      where: {
        id,
        deletedAt: null,
        person: { deletedAt: null },
      },
      include: { person: { include: { documentType: true } } },
    });

    return raw ? ProfessorQueryMapper.toReadModel(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: ProfessorQueryFilters,
  ): Promise<[ProfessorReadModel[], number]> {
    const where: Prisma.ProfessorWhereInput = {
      deletedAt: null,
      person: { deletedAt: null },
      ...(filters?.department && { department: filters.department }),
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
      this.prisma.professor.findMany({
        where,
        include: { person: { include: { documentType: true } } },
        skip: pagination.offset,
        take: pagination.limit,
        orderBy: { person: { lastName: 'asc' } },
      }),

      this.prisma.professor.count({ where }),
    ]);

    return [raws.map(ProfessorQueryMapper.toReadModel), total];
  }
}
