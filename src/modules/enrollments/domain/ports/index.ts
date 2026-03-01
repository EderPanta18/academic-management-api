// modules/enrollments/domain/ports/index.ts

export type { IEnrollmentRepository } from './enrollment.repository.port';
export type { IEnrollmentFinder } from './enrollment.finder.port';
export {
  ENROLLMENT_REPOSITORY_PORT,
  ENROLLMENT_FINDER_PORT,
} from './enrollment.tokens';
