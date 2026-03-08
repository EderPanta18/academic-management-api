// modules/course-offerings/domain/ports/out/index.ts

export type {
  ICourseOfferingRepository,
  FindAllCourseOfferingsFilters,
} from './course-offering.repository.port';
export { COURSE_OFFERING_REPOSITORY_PORT } from './tokens';
