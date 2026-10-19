import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type {
  IProfessorRepository,
  ProfessorCreationData,
} from '@professors/application/ports/out';
import type { Professor } from '@professors/domain/entities';
import { ProfessorRepositoryMapper } from './professor-repository.mapper';

@Injectable()
export class ProfessorRepository implements IProfessorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: ProfessorCreationData): Promise<Professor> {
    const { personData, professorData } = ProfessorRepositoryMapper.toPersistence(input);

    const raw = await this.prisma.$transaction(async (tx) => {
      await tx.person.create({ data: personData });

      return tx.professor.create({ data: professorData });
    });

    return ProfessorRepositoryMapper.toDomain(raw);
  }

  async find(id: string): Promise<Professor | null> {
    const raw = await this.prisma.professor.findFirst({
      where: {
        id,
        deletedAt: null,
        person: { deletedAt: null },
      },
    });

    return raw ? ProfessorRepositoryMapper.toDomain(raw) : null;
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.professor.count({
      where: {
        id,
        deletedAt: null,
        person: { deletedAt: null },
      },
    });

    return count > 0;
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
}
