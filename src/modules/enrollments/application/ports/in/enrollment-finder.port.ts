// modules/enrollments/application/ports/in/enrollment-finder.port.ts

export const ENROLLMENT_FINDER_PORT = Symbol('ENROLLMENT_FINDER_PORT');

export interface IEnrollmentFinder {
  exists(id: number): Promise<boolean>;

  isEnrolledAndActive(id: number): Promise<boolean>;
}
