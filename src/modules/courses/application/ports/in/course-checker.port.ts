export const COURSE_CHECKER_TOKEN = Symbol('COURSE_CHECKER');

export interface ICourseChecker {
  exists(id: string): Promise<boolean>;
}
