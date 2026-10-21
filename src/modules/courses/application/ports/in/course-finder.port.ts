export const COURSE_FINDER_TOKEN = Symbol('COURSE_FINDER');

export interface ICourseFinder {
  getAcademicProgramId(id: string): Promise<string | null>;
}
