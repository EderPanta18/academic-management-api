import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { IStudentRepository, StudentCreationData } from '@students/application/ports/out';
import type { Student } from '@students/domain/entities';
import { StudentRepositoryMapper } from './student-repository.mapper';

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: StudentCreationData): Promise<Student> {
    const { personData, studentData } = StudentRepositoryMapper.toPersistence(input);

    const raw = await this.prisma.$transaction(async (tx) => {
      await tx.person.create({ data: personData });

      return tx.student.create({ data: studentData });
    });

    return StudentRepositoryMapper.toDomain(raw);
  }

  async find(id: string): Promise<Student | null> {
    const raw = await this.prisma.student.findFirst({
      where: {
        id,
        deletedAt: null,
        person: { deletedAt: null },
      },
    });

    return raw ? StudentRepositoryMapper.toDomain(raw) : null;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.student.count({
      where: {
        id,
        deletedAt: null,
        person: { deletedAt: null },
      },
    });

    return count > 0;
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
}
