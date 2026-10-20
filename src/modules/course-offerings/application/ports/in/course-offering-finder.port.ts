export const COURSE_OFFERING_FINDER_TOKEN = Symbol('COURSE_OFFERING_FINDER');

export interface ICourseOfferingFinder {
  getCourseId(id: string): Promise<string | null>;
}
