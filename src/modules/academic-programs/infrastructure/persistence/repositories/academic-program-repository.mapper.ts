import { AcademicProgram } from '@academic-programs/domain/entities';
import type { Prisma } from '@prisma/client';

type AcademicProgramRaw = Prisma.AcademicProgramGetPayload<Record<string, never>>;

export class AcademicProgramRepositoryMapper {
  static toDomain(raw: AcademicProgramRaw): AcademicProgram {
    return AcademicProgram.reconstitute({
      id: raw.id,
      code: raw.code,
      name: raw.name,
      academicUnit: raw.academicUnit,
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
