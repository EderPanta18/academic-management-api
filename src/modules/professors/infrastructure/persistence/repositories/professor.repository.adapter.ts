// modules/professors/infrastructure/persistence/repositories/professor.repository.adapter.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationVO } from '@core/domain/value-objects';
import { PrismaService } from '@shared/infrastructure/persistence';
import { ProfessorStatus } from '@professors/domain/constants';
import { Professor } from '@professors/domain/entities';
import { type ProfessorView } from '@professors/domain/read-models';
import { type IProfessorFinder } from '@professors/domain/ports/in';
import type {
  IProfessorRepository,
  PersonCreationData,
  IProfessorQuery,
  FindAllProfessorsFilters,
} from '@professors/domain/ports/out';
import { ProfessorPersistenceMapper } from '../mappers';

@Injectable()
export class ProfessorRepository
  implements IProfessorRepository, IProfessorQuery, IProfessorFinder
{
  constructor(private readonly prisma: PrismaService) {}

  // ── IProfessorRepository --------------------------------------------------

  async save(
    professor: Professor,
    personData: PersonCreationData,
  ): Promise<Professor> {
    return professor.id !== undefined
      ? this.update(professor, personData)
      : this.create(professor, personData);
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
      ...(filters?.departmentId ? { departmentId: filters.departmentId } : {}),
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

  private async create(
    professor: Professor,
    personData: PersonCreationData,
  ): Promise<Professor> {
    const { person, professor: profData } =
      ProfessorPersistenceMapper.toPersistence(professor, personData);

    const raw = await this.prisma.$transaction(async (tx) => {
      const personRecord = await tx.person.create({ data: person });
      return tx.professor.create({
        data: { ...profData, personId: personRecord.id },
        include: { person: true },
      });
    });

    return ProfessorPersistenceMapper.toDomain(raw);
  }

  private async update(
    professor: Professor,
    personData: PersonCreationData,
  ): Promise<Professor> {
    const { person, professor: profData } =
      ProfessorPersistenceMapper.toPersistence(professor, personData);

    const raw = await this.prisma.$transaction(async (tx) => {
      await tx.person.update({
        where: { id: professor.id },
        data: person,
      });
      return tx.professor.update({
        where: { personId: professor.id },
        data: profData,
        include: { person: true },
      });
    });

    return ProfessorPersistenceMapper.toDomain(raw);
  }
}
