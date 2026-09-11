export const ACADEMIC_PROGRAM_CHECKER_TOKEN = Symbol('ACADEMIC_PROGRAM_CHECKER');

export interface IAcademicProgramChecker {
  exists(id: string): Promise<boolean>;
}
