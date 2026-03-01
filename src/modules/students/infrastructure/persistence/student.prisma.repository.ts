// modules/students/infrastructure/persistence/student.prisma.repository.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/database';
import { PaginationVO } from '@shared/domain/value-objects';
import { Student } from '@students/domain/entities';
import type {
  IStudentRepository,
  IStudentFinder,
} from '@students/domain/ports';
import { type FindAllStudentsFilters } from '@students/domain/ports/student.repository.port';
import { StudentPersistenceMapper } from '../mappers';

@Injectable()
export class StudentPrismaRepository
  implements IStudentRepository, IStudentFinder
{
  constructor(private readonly prisma: PrismaService) {}

  // ── IStudentRepository ────────────────────────────────────────────────────

  async save(student: Student): Promise<Student> {
    return student.id !== undefined
      ? this.update(student)
      : this.create(student);
  }

  async findById(id: number): Promise<Student | null> {
    const raw = await this.prisma.student.findFirst({
      where: {
        personId: id,
        deletedAt: null,
        person: { deletedAt: null },
      },
      include: { person: true },
    });

    return raw ? StudentPersistenceMapper.toDomain(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: FindAllStudentsFilters,
  ): Promise<[Student[], number]> {
    const where: Prisma.StudentWhereInput = {
      deletedAt: null,
      ...(filters?.careerId ? { careerId: filters.careerId } : {}),
    };

    const [raws, total] = await Promise.all([
      this.prisma.student.findMany({
        where,
        include: { person: true },
        skip: pagination.offset,
        take: pagination.pageSize,
        orderBy: { person: { lastName: 'asc' } },
      }),
      this.prisma.student.count({ where }),
    ]);

    return [raws.map(StudentPersistenceMapper.toDomain), total];
  }

  async existsByDni(dni: string): Promise<boolean> {
    const count = await this.prisma.student.count({
      where: {
        deletedAt: null,
        person: { dni, deletedAt: null },
      },
    });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.prisma.student.count({
      where: {
        deletedAt: null,
        person: { email, deletedAt: null },
      },
    });
    return count > 0;
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.prisma.student.count({
      where: {
        code,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.student.update({
      where: { personId: id },
      data: { deletedAt: new Date() },
    });
  }

  // ── IStudentFinder ────────────────────────────────────────────────────────

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.student.count({
      where: {
        personId: id,
        deletedAt: null,
        person: { deletedAt: null },
      },
    });
    return count > 0;
  }

  async isActive(id: number): Promise<boolean> {
    const count = await this.prisma.student.count({
      where: {
        personId: id,
        status: 'ACTIVE',
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async getCareerIdByStudentId(studentId: number): Promise<number | null> {
    const raw = await this.prisma.student.findFirst({
      where: { personId: studentId, deletedAt: null },
      select: { careerId: true },
    });
    return raw?.careerId ?? null;
  }

  // ── Privados ──────────────────────────────────────────────────────────────

  private async create(student: Student): Promise<Student> {
    const { person, student: studentData } =
      StudentPersistenceMapper.toPersistence(student);

    const raw = await this.prisma.$transaction(async (tx) => {
      const personRecord = await tx.person.create({ data: person });

      return tx.student.create({
        data: { ...studentData, personId: personRecord.id },
        include: { person: true },
      });
    });

    return StudentPersistenceMapper.toDomain(raw);
  }

  private async update(student: Student): Promise<Student> {
    const { person, student: studentData } =
      StudentPersistenceMapper.toPersistence(student);

    const raw = await this.prisma.$transaction(async (tx) => {
      await tx.person.update({
        where: { id: student.id },
        data: person,
      });

      return tx.student.update({
        where: { personId: student.id },
        data: studentData,
        include: { person: true },
      });
    });

    return StudentPersistenceMapper.toDomain(raw);
  }
}
