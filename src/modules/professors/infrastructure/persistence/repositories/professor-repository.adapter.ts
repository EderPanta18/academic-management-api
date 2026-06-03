// modules/professors/infrastructure/persistence/repositories/professor-repository.adapter.ts

import { PaginationVO } from '@core/pagination';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import { Prisma } from '@prisma/client';
import type {
  FindAllProfessorsFilters,
  IProfessorFinder,
  IProfessorQuery,
  IProfessorRepository,
  ProfessorSaveData,
} from '@professors/application/ports';
import type { ProfessorView } from '@professors/application/read-models';
import { ProfessorStatus } from '@professors/domain/constants';
import { Professor } from '@professors/domain/entities';
import { ProfessorPersistenceMapper } from '../mappers';

@Injectable()
export class ProfessorRepository
  implements IProfessorRepository, IProfessorQuery, IProfessorFinder
{
  constructor(private readonly prisma: PrismaService) {}

  // ── IProfessorRepository --------------------------------------------------

  async save(data: ProfessorSaveData): Promise<Professor> {
    const { professor } = data;

    return professor.id !== undefined ? this.update(data) : this.create(data);
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.prisma.professor.count({
      where: { code, deletedAt: null },
    });

    return count > 0;
  }

  async existsByInstitutionalEmail(email: string): Promise<boolean> {
    const count = await this.prisma.professor.count({
      where: { institutionalEmail: email, deletedAt: null },
    });

    return count > 0;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.professor.update({
        where: { personId: id },
        data: { deletedAt: new Date() },
      });

      await tx.person.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });
  }

  // ── IProfessorQuery -------------------------------------------------------

  async findById(id: number): Promise<ProfessorView | null> {
    const raw = await this.prisma.professor.findFirst({
      where: { personId: id, deletedAt: null, person: { deletedAt: null } },
      include: { person: true },
    });

    return raw ? ProfessorPersistenceMapper.toView(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: FindAllProfessorsFilters,
  ): Promise<[ProfessorView[], number]> {
    const where: Prisma.ProfessorWhereInput = {
      deletedAt: null,
      ...(filters?.departmentId && { departmentId: filters.departmentId }),
    };

    const [raws, total] = await Promise.all([
      this.prisma.professor.findMany({
        where,
        include: { person: true },
        skip: pagination.offset,
        take: pagination.pageSize,
        orderBy: { person: { lastName: 'asc' } },
      }),

      this.prisma.professor.count({ where }),
    ]);

    return [raws.map(ProfessorPersistenceMapper.toView), total];
  }

  // ── IProfessorFinder ------------------------------------------------------

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.professor.count({
      where: { personId: id, deletedAt: null, person: { deletedAt: null } },
    });

    return count > 0;
  }

  async isActive(id: number): Promise<boolean> {
    const count = await this.prisma.professor.count({
      where: {
        personId: id,
        status: ProfessorStatus.ACTIVE,
        deletedAt: null,
        person: { deletedAt: null },
      },
    });

    return count > 0;
  }

  // ── Privados ──────────────────────────────────────────────────────────────

  private async create(data: ProfessorSaveData): Promise<Professor> {
    const { professorData, personData } = ProfessorPersistenceMapper.toPersistence(data);

    const raw = await this.prisma.$transaction(async (tx) => {
      const personRecord = await tx.person.create({ data: personData });

      return tx.professor.create({
        data: { ...professorData, personId: personRecord.id },
        include: { person: true },
      });
    });

    return ProfessorPersistenceMapper.toDomain(raw);
  }

  private async update(data: ProfessorSaveData): Promise<Professor> {
    const { professor } = data;

    const { personData, professorData } = ProfessorPersistenceMapper.toPersistence(data);

    const raw = await this.prisma.$transaction(async (tx) => {
      await tx.person.update({
        where: { id: professor.id },
        data: personData,
      });

      return tx.professor.update({
        where: { personId: professor.id },
        data: professorData,
        include: { person: true },
      });
    });

    return ProfessorPersistenceMapper.toDomain(raw);
  }
}
