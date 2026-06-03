// modules/courses/application/ports/in/course-finder.port.ts

export const COURSE_FINDER_PORT = Symbol('COURSE_FINDER_PORT');

export interface ICourseFinder {
  exists(id: number): Promise<boolean>;
}
