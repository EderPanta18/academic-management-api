export const ACADEMIC_PROGRAM_FINDER_TOKEN = Symbol('ACADEMIC_PROGRAM_FINDER');

export interface IAcademicProgramFinder {
  findIdByCode(code: string): Promise<string | null>;
}
