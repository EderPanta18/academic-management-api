// modules/course-offerings/application/ports/in/course-offering-finder.port.ts

export const COURSE_OFFERING_FINDER_PORT = Symbol('COURSE_OFFERING_FINDER_PORT');

export interface ICourseOfferingFinder {
  exists(id: number): Promise<boolean>;

  isOpenForEnrollment(id: number): Promise<boolean>;

  getCourseCareerIdByOfferingId(offeringId: number): Promise<number | null>;
}
