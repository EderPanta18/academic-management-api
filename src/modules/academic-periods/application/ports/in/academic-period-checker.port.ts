export const ACADEMIC_PERIOD_CHECKER_TOKEN = Symbol('ACADEMIC_PERIOD_CHECKER');

export interface IAcademicPeriodChecker {
  exists(id: string): Promise<boolean>;

  isOpen(id: string): Promise<boolean>;

  allowsEnrollment(id: string, referenceDate?: Date): Promise<boolean>;
}
