export const STUDENT_CHECKER_TOKEN = Symbol('STUDENT_CHECKER');

export interface IStudentChecker {
  exists(id: string): Promise<boolean>;

  isActive(id: string): Promise<boolean>;
}
