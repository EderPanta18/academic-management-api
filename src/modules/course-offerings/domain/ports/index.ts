// modules/course-offerings/domain/ports/index.ts

export type { ICourseOfferingRepository } from './course-offering.repository.port';
export type { ICourseOfferingFinder } from './course-offering.finder.port';
export {
  COURSE_OFFERING_REPOSITORY_PORT,
  COURSE_OFFERING_FINDER_PORT,
} from './course-offering.tokens';
