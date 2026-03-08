// modules/students/infrastructure/persistence/repositories/student.repository.adapter.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/persistence';
import { PaginationVO } from '@shared/domain/value-objects';
import { Student } from '@students/domain/entities';
import { type StudentView } from '@students/domain/read-models';
import { type IStudentFinder } from '@students/domain/ports/in';
import type {
  IStudentRepository,
  PersonCreationData,
  IStudentQuery,
  FindAllStudentsFilters,
} from '@students/domain/ports/out';
import { StudentPersistenceMapper } from '../mappers';

@Injectable()
export class StudentRepository
  implements IStudentRepository, IStudentQuery, IStudentFinder
{
  constructor(private readonly prisma: PrismaService) {}

  // ── IStudentRepository ────────────────────────────────────────────────────

  async save(
    student: Student,
    personData: PersonCreationData,
  ): Promise<Student> {
    return student.id !== undefined
      ? this.update(student, personData)
      : this.create(student, personData);
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.prisma.student.count({
      where: { code, deletedAt: null },
    });
    return count > 0;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.student.update({
        where: { personId: id },
        data: { deletedAt: new Date() },
      });
      await tx.person.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });
  }

  // ── IStudentQuery ---------------------------------------------------------

  async findById(id: number): Promise<StudentView | null> {
    const raw = await this.prisma.student.findFirst({
      where: { personId: id, deletedAt: null, person: { deletedAt: null } },
      include: { person: true },
    });
    return raw ? StudentPersistenceMapper.toView(raw) : null;
  }

  async findAll(
    pagination: PaginationVO,
    filters?: FindAllStudentsFilters,
  ): Promise<[StudentView[], number]> {
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

    return [raws.map(StudentPersistenceMapper.toView), total];
  }

  // ── IStudentFinder --------------------------------------------------------

  async exists(id: number): Promise<boolean> {
    const count = await this.prisma.student.count({
      where: { personId: id, deletedAt: null, person: { deletedAt: null } },
    });
    return count > 0;
  }

  async isActive(id: number): Promise<boolean> {
    const count = await this.prisma.student.count({
      where: {
        personId: id,
        status: 'ACTIVE',
        deletedAt: null,
        person: { deletedAt: null },
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

  private async create(
    student: Student,
    personData: PersonCreationData,
  ): Promise<Student> {
    const { person, student: studentData } =
      StudentPersistenceMapper.toPersistence(student, personData);

    const raw = await this.prisma.$transaction(async (tx) => {
      const personRecord = await tx.person.create({ data: person });
      return tx.student.create({
        data: { ...studentData, personId: personRecord.id },
        include: { person: true },
      });
    });

    return StudentPersistenceMapper.toDomain(raw);
  }

  private async update(
    student: Student,
    personData: PersonCreationData,
  ): Promise<Student> {
    const { person, student: studentData } =
      StudentPersistenceMapper.toPersistence(student, personData);

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
