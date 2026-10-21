export const ENROLLMENT_CHECKER_TOKEN = Symbol('ENROLLMENT_CHECKER');

export interface IEnrollmentChecker {
  exists(id: string): Promise<boolean>;

  isEnrolled(id: string): Promise<boolean>;
}
