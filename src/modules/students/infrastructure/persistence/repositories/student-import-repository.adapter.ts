import { Injectable } from '@nestjs/common';
import { PrismaService } from '@platform/database';
import type { IStudentImportRepository } from '@students/application/ports/out';
import type { StudentImport } from '@students/domain/entities';
import { StudentImportRepositoryMapper } from './student-import-repository.mapper';

@Injectable()
export class StudentImportRepository implements IStudentImportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(studentImport: StudentImport, fileContent: Buffer): Promise<StudentImport> {
    const data = StudentImportRepositoryMapper.toPersistence(studentImport);

    const raw = await this.prisma.studentImport.create({
      data: {
        ...data,
        fileContent: StudentImportRepositoryMapper.toBytes(fileContent),
      },
    });

    return StudentImportRepositoryMapper.toDomain(raw);
  }

  async update(studentImport: StudentImport): Promise<StudentImport> {
    const data = StudentImportRepositoryMapper.toPersistence(studentImport);

    const raw = await this.prisma.studentImport.update({
      where: { id: studentImport.id },
      data,
    });

    return StudentImportRepositoryMapper.toDomain(raw);
  }

  async find(id: string): Promise<StudentImport | null> {
    const raw = await this.prisma.studentImport.findFirst({
      where: { id },
    });

    return raw ? StudentImportRepositoryMapper.toDomain(raw) : null;
  }

  async findFileContent(id: string): Promise<Buffer | null> {
    const raw = await this.prisma.studentImport.findFirst({
      where: { id },
      select: { fileContent: true },
    });

    return raw ? StudentImportRepositoryMapper.fromBytes(raw.fileContent) : null;
  }

  async existsByHashAndUser(fileHash: string, createdByUserId: string): Promise<boolean> {
    const count = await this.prisma.studentImport.count({
      where: {
        fileHash,
        createdByUserId,
      },
    });

    return count > 0;
  }
}
