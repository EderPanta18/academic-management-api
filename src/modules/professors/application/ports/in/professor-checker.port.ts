export const PROFESSOR_CHECKER_TOKEN = Symbol('PROFESSOR_CHECKER');

export interface IProfessorChecker {
  exists(id: string): Promise<boolean>;

  isActive(id: string): Promise<boolean>;
}
