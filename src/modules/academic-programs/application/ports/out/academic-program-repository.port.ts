import type { AcademicProgram } from '@academic-programs/domain/entities';

export const ACADEMIC_PROGRAM_REPOSITORY_TOKEN = Symbol('ACADEMIC_PROGRAM_REPOSITORY');

export interface IAcademicProgramRepository {
  create(academicProgram: AcademicProgram): Promise<AcademicProgram>;

  findByCode(code: string): Promise<AcademicProgram | null>;

  exists(id: string): Promise<boolean>;

  existsByCode(code: string): Promise<boolean>;

  existsByName(name: string): Promise<boolean>;
}
