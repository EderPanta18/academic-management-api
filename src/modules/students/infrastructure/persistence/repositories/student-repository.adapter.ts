// modules/students/infrastructure/persistence/repositories/student-repository.adapter.ts

import type { PaginationVO } from '@core/pagination';
import { Injectable } from '@nestjs/common';
import type { PrismaService } from '@platform/database';
import type { Prisma } from '@prisma/client';
import type {
  FindAllStudentsFilters,
  IStudentFinder,
  IStudentQuery,
  IStudentRepository,
  StudentSaveData,
} from '@students/application/ports';
import type { StudentView } from '@students/application/read-models';
import { StudentStatus } from '@students/domain/constants';
import type { Student } from '@students/domain/entities';
import { StudentPersistenceMapper } from '../mappers';

@Injectable()
export class StudentRepository implements IStudentRepository, IStudentQuery, IStudentFinder {
  constructor(private readonly prisma: PrismaService) {}

  // ── IStudentRepository ────────────────────────────────────────────────────

  async save(data: StudentSaveData): Promise<Student> {
    const { student } = data;

    return student.id !== undefined ? this.update(data) : this.create(data);
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.prisma.student.count({
      where: { code, deletedAt: null },
    });

    return count > 0;
  }

  async existsByInstitutionalEmail(email: string): Promise<boolean> {
    const count = await this.prisma.student.count({
      where: { institutionalEmail: email, deletedAt: null },
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
      ...(filters?.careerId && { careerId: filters.careerId }),
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
        status: StudentStatus.ACTIVE,
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

  private async create(data: StudentSaveData): Promise<Student> {
    const { personData, studentData } = StudentPersistenceMapper.toPersistence(data);

    const raw = await this.prisma.$transaction(async (tx) => {
      const personRecord = await tx.person.create({ data: personData });

      return tx.student.create({
        data: { ...studentData, personId: personRecord.id },
        include: { person: true },
      });
    });

    return StudentPersistenceMapper.toDomain(raw);
  }

  private async update(data: StudentSaveData): Promise<Student> {
    const { student } = data;

    const { personData, studentData } = StudentPersistenceMapper.toPersistence(data);

    const raw = await this.prisma.$transaction(async (tx) => {
      await tx.person.update({
        where: { id: student.id },
        data: personData,
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
