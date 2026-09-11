import { AcademicProgram } from '@academic-programs/domain/entities';
import type { AcademicProgram as AcademicProgramRecord, Prisma } from '@prisma/client';

export class AcademicProgramRepositoryMapper {
  static toDomain(record: AcademicProgramRecord): AcademicProgram {
    return AcademicProgram.reconstitute({
      id: record.id,
      code: record.code,
      name: record.name,
      academicUnit: record.academicUnit,
    });
  }

  static toPersistence(
    academicProgram: AcademicProgram,
  ): Prisma.AcademicProgramUncheckedCreateInput {
    return {
      id: academicProgram.id,
      code: academicProgram.code,
      name: academicProgram.name,
      academicUnit: academicProgram.academicUnit,
    };
  }
}
