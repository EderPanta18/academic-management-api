export const COURSE_OFFERING_CHECKER_TOKEN = Symbol('COURSE_OFFERING_CHECKER');

export interface ICourseOfferingChecker {
  exists(id: string): Promise<boolean>;

  isOpen(id: string): Promise<boolean>;

  hasAvailableCapacity(id: string): Promise<boolean>;
}
