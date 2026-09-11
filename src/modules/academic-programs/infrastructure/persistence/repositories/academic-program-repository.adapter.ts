import type { IAcademicProgramRepository } from '@academic-programs/application/ports/out';
import type { AcademicProgram } from '@academic-programs/domain/entities';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import { AcademicProgramRepositoryMapper } from './academic-program-repository.mapper';

@Injectable()
export class AcademicProgramRepository implements IAcademicProgramRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(academicProgram: AcademicProgram): Promise<AcademicProgram> {
    const data = AcademicProgramRepositoryMapper.toPersistence(academicProgram);

    const record = await this.prisma.academicProgram.create({
      data,
    });

    return AcademicProgramRepositoryMapper.toDomain(record);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.academicProgram.count({
      where: { id, deletedAt: null },
    });

    return count > 0;
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.prisma.academicProgram.count({
      where: {
        code,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.prisma.academicProgram.count({
      where: {
        name,
        deletedAt: null,
      },
    });

    return count > 0;
  }
}
