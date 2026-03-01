// modules/courses/domain/ports/index.ts

export type { ICourseRepository } from './course.repository.port';
export type { ICourseFinder } from './course.finder.port';
export { COURSE_REPOSITORY_PORT, COURSE_FINDER_PORT } from './course.tokens';
